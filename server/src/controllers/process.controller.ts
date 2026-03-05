import asyncHandler from "@/utils/asyncHandler";
import ApiError from "@/utils/apiError";
import ApiResponse from "@/utils/apiResponse";
import { type Request, type Response } from "express";
import { Job } from "@/models/job.models";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

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
        const uint8Array = new Uint8Array(buffer)
        const parser = new PDFParse(uint8Array)
        const parsed = await parser.getText()

        return parsed.text
            .replace(/\n+/g, "\n")
            .replace(/\s+/g, " ")
            .replace(/--\s*\d+\s*of\s*\d+\s*--/g, "")
            .trim()
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

        const text = await extractText(buffer, mimeType)
        console.log('Text extracted, length: ', text.length)
        console.log('Extracted text:\n', text)

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