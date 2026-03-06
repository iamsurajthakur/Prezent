import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import { type Request, type Response } from "express";
import { Job } from "@/models/job.models";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs"
import { chunkText } from "@/utils/chunker";

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

async function runPipeline(signedUrl: string, jobId: string, mimeType: string){
    try {
        await Job.findByIdAndUpdate(jobId,{ status: 'processing'})

        const buffer = await fetchFileBuffer(signedUrl)

        let text = await extractText(buffer, mimeType)
        console.log('Text extracted, length: ', text.length)

        text = cleanAcademicNoise(text)

        const chunks = chunkText(text, { maxWords:50, overlap: 30 })
        console.log(`Chunks created: ${chunks.length}`)
        console.log(chunks)

         // ── Chunking, HuggingFace, PPT generation go here next ──
        // For now just mark done to verify the flow works
        await Job.findByIdAndUpdate(jobId, { status: "done" });

    } catch (err: any) {
        console.error('Pipeline error: ', err)
        await Job.findByIdAndUpdate(jobId, {status: 'error'})
    }
}

const processPpt = asyncHandler(async (req: Request, res: Response) => {
  const { signedUrl, jobId, mimeType } = req.body;

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
  runPipeline(signedUrl, jobId, mimeType);
})

const getJobStatus = asyncHandler(async (req: Request, res: Response) => {
    const { jobId } = req.params

    if(!jobId){
        throw new ApiError(400,'jobId is required')
    }

    const job = await Job.findById(jobId).select('status outputUrl')

    if(!job){
        throw new ApiError(404,'Job not found')
    }

    return res.status(200).json(
        new ApiResponse(200, {
            status: job.status,
            outputUrl: job.outputUrl ?? null,
        }, 'Job status fetched')
    )
})

export {
    processPpt,
    getJobStatus
}