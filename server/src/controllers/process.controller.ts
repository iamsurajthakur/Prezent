import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import { type Request, type Response } from "express";
import { Job } from "@/models/job.models";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import { chunkText } from "@/utils/chunker";
import { getSlideJsonInternal } from "@/services/slide.service";
import { generatePPT } from "@/utils/generatePPT";
import { updateStats } from "@/utils/updateStats";
import { Presentation } from "@/models/presentation.models";
import { Activity } from "@/models/activity.models";
import { startSession } from "mongoose";

function cleanText(text: string): string {
    return text
        .replace(/\n+/g, "\n")
        .replace(/\s+/g, " ")
        .replace(/--\s*\d+\s*of\s*\d+\s*--/g, "")
        .trim()
}

function cleanAcademicNoise(text: string): string {
  return text
    // remove emails
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, "")

    // remove academic symbols (* † ‡ etc)
    .replace(/[†‡∗*]/g, "")

    // remove affiliations (very common in papers)
    .replace(/Department of.*?\n/g, "")

    // remove page numbers
    .replace(/\n\d+\s*\n/g, "\n")

    // collapse spaces
    .replace(/\s{2,}/g, " ")

    .trim();
}

async function extractWithPdfJs(buffer: Buffer): Promise<string>{
    const data = new Uint8Array(buffer)

    const pdf = await pdfjsLib.getDocument({ data }).promise
    let text = ''

    for(let i = 1; i<= pdf.numPages; i++){
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()

        const pageText = content.items
            .map((item: any) => item.str)
            .join(' ')

        text += pageText + '\n'
    }

    return text

}

async function fetchFileBuffer(signedUrl: string): Promise<Buffer> {
    const res = await fetch(signedUrl)

    if(!res.ok){
        throw new ApiError(400,`Failed to fetch file: ${res.statusText}`)
    }

    const arrayBuffer = await res.arrayBuffer()
    return Buffer.from(arrayBuffer)
}

async function extractText(buffer: Buffer, mimeType: string): Promise<string> {
    if(mimeType === 'application/pdf'){

        try {
            const text = await extractWithPdfJs(buffer)

            if(text && text.trim().length > 50){
                return cleanText(text)
            }
        } catch (err: any) {
            console.warn('pdfjs extraction failed, falling back', err)
        }

        const uint8Array = new Uint8Array(buffer)
        const parser = new PDFParse(uint8Array)
        const parsed = await parser.getText()

        return cleanText(parsed.text)
    }

    if(mimeType == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
        const parsed = await mammoth.extractRawText({ buffer })
        return parsed.value
    }

    throw new ApiError(400,`Unsupported file type: ${mimeType}`)
}

async function runPipeline(signedUrl: string, jobId: string, mimeType: string, userId: string, originalName: string){
    try {
        await Job.findByIdAndUpdate(jobId,{ status: 'processing', step: 1}) // uploading file

        const buffer = await fetchFileBuffer(signedUrl)
        await Job.findByIdAndUpdate(jobId, {step: 2})// text extraction
        let text = await extractText(buffer, mimeType)

        text = cleanAcademicNoise(text)

        await Job.findByIdAndUpdate(jobId, {step: 3})
        const chunks = chunkText(text, { maxWords:50, overlap: 30 })


         // LLM Call
         await Job.findByIdAndUpdate(jobId, {step: 4})
         const slides = await getSlideJsonInternal(chunks, userId.toString())

         if(!slides || slides.length === 0){
            throw new Error("LLM failed to generate slides")
        }

        await Job.findByIdAndUpdate(jobId, {step: 5})
        const pptUrl = await generatePPT(slides, userId, jobId, mimeType)

        // For now just mark done to verify the flow works
        await Presentation.create({
            userId,
            name: originalName ?? `Presentation ${Date.now()}`,
            slides: slides.length,
            outputUrl: pptUrl
        })

        await updateStats(userId, {
            presentationGenerated: 1,
            slidesGenerated: slides.length,
            addSlidesToChart: slides.length,
        })

        await Activity.create({
            userId,
            type: 'generate',
            label: 'Generated',
            subject: `${slides.length} slides`,
            context: originalName,
        })

        await Job.findByIdAndUpdate(jobId, { status: "done", step: 6, outputUrl: pptUrl });

    } catch (err: any) {
        console.error('Pipeline error: ', err)
        await Job.findByIdAndUpdate(jobId, {status: 'error'})
    }
}

const processPpt = asyncHandler(async (req: Request, res: Response) => {
  const { signedUrl, jobId, mimeType, userId, originalName } = req.body;

  if (!signedUrl || !jobId || !mimeType) {
    throw new ApiError(400, "signedUrl, jobId and mimeType are required");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  if (job.status !== "pending") {
    throw new ApiError(400, `Job is already ${job.status}`);
  }

  // Respond immediately — don't await the pipeline
  res.status(200).json(
    new ApiResponse(200, { jobId }, "Processing started")
  );

  // Fire and forget — runs after response is sent
  runPipeline(signedUrl, jobId, mimeType, userId, originalName);
})

const getJobStatus = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params

    if(!jobId){
        throw new ApiError(400,'jobId is required')
    }

    const job = await Job.findById(jobId).select('status outputUrl step')

    if(!job){
        throw new ApiError(404,'Job not found')
    }

    return res.status(200).json(
        new ApiResponse(200, {
            status: job.status,
            step: job.step ?? 0,
            outputUrl: job.outputUrl ?? null,
        }, 'Job status fetched')
    )
})

const deletePpt = asyncHandler (async (req: Request, res: Response) => {
    const userId = req.user?._id

    if(!userId){
        throw new ApiError(404,'User not found')
    }

    await Presentation.findOneAndDelete({
        _id: req.params.id,
        userId,
    })

    res.status(200).json(new ApiResponse(
        200,
        {},
        'Presentation deleted.'
    ))
})

export {
    processPpt,
    getJobStatus,
    deletePpt
}