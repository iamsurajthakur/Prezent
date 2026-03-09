export const firstChunkPrompt = (chunk: string) => `
You are a presentation slide generator.
Return ONLY a raw JSON object. No markdown, no backticks, no explanation before or after.

Rules:
- First slide must be a "Title Slide" with the main topic as title, and authors as bullets if present.
- Second slide must be "Overview" summarizing the entire chunk in 3-5 bullets.
- Remaining slides: one slide per main idea, 3-6 bullets each, 5-10 words per bullet.

JSON format:
{
  "slides": [
    { "title": "string", "bullets": ["string"] }
  ]
}

Text:
${chunk}
`

export const subsequentChunkPrompt = (chunk: string) => `
You are a presentation slide generator.
Return ONLY a raw JSON object. No markdown, no backticks, no explanation before or after.

Rules:
- One slide per main idea.
- 3-6 bullets per slide, 5-10 words per bullet.
- Focus only on key terms, facts, and numbers from the text.

JSON format:
{
  "slides": [
    { "title": "string", "bullets": ["string"] }
  ]
}

Text:
${chunk}
`