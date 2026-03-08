
type DocType = "list" | "report" | "resume" | "academic" | "general";

//  Step 1: Clean noise from any document 
function cleanText(text: string): string {
  return text
    // ── Step 1: Protect section headings FIRST before any newline collapsing ──
    // Add a sentinel around lines that look like "I. INTRODUCTION", "II. RELATED WORK"
    .replace(/\n([IVX]+\.\s+[A-Z][A-Z\s]{2,})\n/g, "\n\n$1\n\n")

    // ── Step 2: Fix broken PDF words (single chars on own lines) ──
    // Only collapse newlines between LOWERCASE letters (mid-sentence breaks)
    .replace(/([a-z,])\n([a-z])/g, "$1 $2")          // ← lowercase only, not ALL letters
    .replace(/\n([a-z])/g, " $1")                     // lowercase after newline = mid-sentence

    // ── Step 3: Fix spaced caps in headings "R ELATED" → "RELATED" ──
    // Only do this WITHIN heading context (after Roman numerals)
    .replace(/([IVX]+\.\s+)([A-Z])\s([A-Z])/g, (_, prefix, a, b) => `${prefix}${a}${b}`)

    // ── Step 4: Standard cleanup ──
    .replace(/https?:\/\/[^\s]+/g, "")
    .replace(/\[\d+\]/g, "")
    .replace(/⁂/g, "")
    .replace(/(\d{4})(Location|Organizer|Theme|Prize|Deadline|Fee|Focus|Orientation)/g, "$1\n$2")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

//  Step 2: Detect what kind of document this is 
function detectDocType(text: string): DocType {
  const lower = text.toLowerCase();
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  const scores: Record<DocType, number> = {
    resume: 0, academic: 0, report: 0, list: 0, general: 0,
  };

  // ── Resume: needs MULTIPLE strong co-occurring signals ──
  const resumeSignals = [
    /\b(work experience|professional experience)\b/i,   // not just "experience"
    /\b(bachelor|master|b\.tech|b\.sc|m\.sc|phd)\b/i,
    /\b(curriculum vitae|resume|cv)\b/i,
    /\b(linkedin|github\.com\/[a-z])/i,
  ];
  const resumeHits = resumeSignals.filter(r => r.test(text)).length;
  if (resumeHits >= 2) scores.resume += resumeHits * 2;  // needs 2+ signals

  // ── Academic ──
  if (/\babstract\b/i.test(text)) scores.academic += 3;
  if (/\bmethodology\b/i.test(text)) scores.academic += 2;
  if (/\bliterature review\b/i.test(text)) scores.academic += 2;
  if (/et al\./i.test(text)) scores.academic += 2;
  if (/\bhypothesis\b/i.test(text)) scores.academic += 2;
  if (/\bconclusion\b/i.test(text)) scores.academic += 1;

  // ── Report ──
  if (/\bexecutive summary\b/i.test(text)) scores.report += 3;
  if (/\brecommendations\b/i.test(text)) scores.report += 2;
  if (/\bfindings\b/i.test(text)) scores.report += 2;
  if (/\bappendix\b/i.test(text)) scores.report += 1;

  // ── List: events, catalogues, directories ──
  const dateCount = (text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\d{4})/gi) || []).length;
  const bulletCount = lines.filter(l => /^[-•*►]/.test(l)).length;
  const shortLineRatio = lines.filter(l => l.split(" ").length < 8).length / lines.length;

  if (dateCount > 6)          scores.list += 3;
  if (bulletCount > 5)        scores.list += 2;
  if (shortLineRatio > 0.4)   scores.list += 2;

  // If lines have repeating structure (Date:, Location:, Organizer:) = strong list signal
  const structuredLineCount = lines.filter(l =>
    /^(date|location|organizer|theme|prize|deadline|fee):/i.test(l)
  ).length;
  if (structuredLineCount > 3) scores.list += 4;

  const winner = (Object.entries(scores) as [DocType, number][])
    .sort((a, b) => b[1] - a[1])[0];

  const detected: DocType = winner[1] >= 2 ? winner[0] : "general";
  console.log(`[chunker] Detected doc type: ${detected}`, scores);
  return detected;
}

//  Step 3: Shared helpers 

// Your original recursive splitter — kept exactly as-is
function splitRecursive(
  text: string,
  maxWords: number,
  separators = ["\n\n", "\n", ". ", " "],
  separatorIndex = 0
): string[] {
  if (separatorIndex >= separators.length) return [text];

  const sep = separators[separatorIndex];
  const parts = text.split(sep).filter((p) => p.trim().length > 0);
  const result: string[] = [];

  for (const part of parts) {
    const wordCount = part.split(/\s+/).length;
    if (wordCount <= maxWords) {
      result.push(part.trim());
    } else {
      result.push(...splitRecursive(part, maxWords, separators, separatorIndex + 1));
    }
  }

  return result;
}

// Step 4: Strategy per doc type 

function chunkResume(text: string): string[] {
  // Each resume section = one slide, never split mid-section
  const sectionPattern = /\n(?=(EXPERIENCE|EDUCATION|SKILLS|PROJECTS|SUMMARY|CERTIFICATIONS|ACHIEVEMENTS|OBJECTIVE|PROFILE|WORK HISTORY)[^\n]*\n)/gi;
  const sections = text
    .split(sectionPattern)
    .map((s) => s.trim())
    .filter((s) => s.length > 20);

  return sections.slice(0, 8); // resumes don't need more than 8 slides
}

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function enforceMaxWords(chunks: string[], maxWords: number): string[] {
  const safe: string[] = [];

  for (const chunk of chunks) {
    const words = chunk.split(/\s+/);

    if (words.length <= maxWords) {
      safe.push(chunk);
      continue;
    }

    for (let i = 0; i < words.length; i += maxWords) {
      safe.push(words.slice(i, i + maxWords).join(" "));
    }
  }

  return safe;
}

function mergeIntoChunks(parts: string[], maxWords: number): string[] {
  const chunks: string[] = [];

  let current = "";
  let currentWords = 0;

  for (const part of parts) {
    const wc = part.split(/\s+/).length;

    if (currentWords + wc > maxWords && current) {
      chunks.push(current.trim());
      current = part;
      currentWords = wc;
    } else {
      current += (current ? "\n\n" : "") + part;
      currentWords += wc;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export function chunkAcademic(text: string, maxWords: number = 500): string[] {

  // 1️⃣ Normalize messy PDF text
  text = normalizeText(text);

  // 2️⃣ Remove references section (not useful for slides)
  const withoutRefs = text.replace(/\bREFERENCES?\b[\s\S]*$/i, "").trim();

  // 3️⃣ Detect roman numeral section headings
  const sectionPattern = /(?=(?:^|\n)\s*[IVX]{1,4}\.\s+[A-Z][A-Z\s]{3,})/g;

  let sections = withoutRefs
    .split(sectionPattern)
    .map(s => s.trim())
    .filter(s => s.split(/\s+/).length > 30);

  console.log(`[chunker] Academic sections found: ${sections.length}`);

  // 4️⃣ Fallback: paragraph chunking
  if (sections.length < 3) {

    console.log("[chunker] Heading detection failed, falling back to paragraph merge");

    const paragraphs = withoutRefs
      .split(/\n+/)
      .map(p => p.trim())
      .filter(p => p.split(/\s+/).length > 20);

    const merged = mergeIntoChunks(paragraphs, maxWords);

    return enforceMaxWords(merged, maxWords);
  }

  // 5️⃣ Merge sections into chunks
  const chunks: string[] = [];

  let current = "";
  let currentWords = 0;

  for (const section of sections) {

    const wc = section.split(/\s+/).length;

    // Section extremely large → split by paragraph
    if (wc > maxWords * 2) {

      if (current) {
        chunks.push(current.trim());
        current = "";
        currentWords = 0;
      }

      const paras = section
        .split(/\n+/)
        .map(p => p.trim())
        .filter(p => p.split(/\s+/).length > 10);

      for (const para of paras) {

        const pwc = para.split(/\s+/).length;

        if (currentWords + pwc > maxWords && current) {
          chunks.push(current.trim());
          current = para;
          currentWords = pwc;
        } else {
          current += (current ? "\n\n" : "") + para;
          currentWords += pwc;
        }
      }

    } else if (currentWords + wc > maxWords && current) {

      chunks.push(current.trim());
      current = section;
      currentWords = wc;

    } else {

      current += (current ? "\n\n" : "") + section;
      currentWords += wc;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return enforceMaxWords(chunks, maxWords);
}

function chunkList(text: string): string[] {
  const lines = text.split("\n").filter(l => l.trim().length > 0);

  const isMetadataLine = (line: string) =>
    /^(date|location|organizer|theme|prize|deadline|fee|application|orientation|semi-final|focus):/i.test(line.trim());

  // A real event header = short capitalized line whose NEXT line is metadata
  const isEventHeader = (line: string, nextLine: string = "") =>
    line.length < 80 &&
    !/^[-•*►]/.test(line) &&
    !isMetadataLine(line) &&
    /^[A-Z]/.test(line) &&
    !/[.,:;]$/.test(line.trim()) &&
    isMetadataLine(nextLine); // ← key fix: next line must be Date/Location/etc

  const chunks: string[] = [];
  let current: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1] || "";

    if (isEventHeader(line, nextLine) && current.length > 0) {
      chunks.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) chunks.push(current.join("\n"));

  return chunks.filter(c => c.trim().split(/\s+/).length >= 10);
}

function chunkGeneral(text: string, maxWords: number, overlap: number): string[] {
  // Your original algorithm — best for general prose
  const pieces = splitRecursive(text, maxWords);
  const chunks: string[] = [];
  let current: string[] = [];
  let currentWordCount = 0;

  for (const piece of pieces) {
    const wordCount = piece.split(/\s+/).length;

    if (currentWordCount + wordCount > maxWords) {
      if (current.length > 0) {
        chunks.push(current.join("\n\n"));
      }
      // Overlap: carry last N words into next chunk
      const overlapText = current
        .join(" ")
        .split(/\s+/)
        .slice(-overlap)
        .join(" ");
      current = overlapText ? [overlapText, piece] : [piece];
      currentWordCount = current.join(" ").split(/\s+/).length;
    } else {
      current.push(piece);
      currentWordCount += wordCount;
    }
  }

  if (current.length > 0) chunks.push(current.join("\n\n"));
  return chunks;
}

// ── Main Export ──

interface ChunkOptions {
  maxWords?: number;
  overlap?: number;
}

export function chunkText(rawText: string, options: ChunkOptions = {}): string[] {
  const { maxWords = 350, overlap = 30 } = options;

  const text = cleanText(rawText);
  const docType = detectDocType(text);

  let chunks: string[];

  switch (docType) {
    case "resume":
      chunks = chunkResume(text);
      break;
    case "list":
      chunks = chunkList(text);
      break;
    case "academic":
      chunks = chunkAcademic(text, maxWords);
      break;
    case "report":
      // Reports benefit from tighter chunks (each finding = one slide)
      chunks = chunkGeneral(text, 300, overlap);
      break;
    default:
      // Your original algorithm for general prose
      chunks = chunkGeneral(text, maxWords, overlap);
  }

  // ── Final guard: drop empty or URL-only chunks ──
  return chunks.filter((c) => {
    const words = c.trim().split(/\s+/).filter((w) => !/https?:/.test(w));
    return words.length >= 10; // minimum meaningful content
  });
}


//  4 strategies based on doc type
//  URLs, citations stripped first
//  Still used, just modularized
//  Only for general/report prose
//  (wrong for resumes/lists)
//  Logs detected type + scores


// ## What overlap does (important for slides)

// Without overlap, chunk boundaries lose context:

// Without overlap:
// Chunk 3 ends:   "...the treatment reduced symptoms significantly."
// Chunk 4 starts: "This led to improved patient outcomes..."
//                  ↑ LLM doesn't know WHAT led to this

// With overlap (30 words carried over):
// Chunk 4 starts: "...treatment reduced symptoms significantly.
//                  This led to improved patient outcomes..."
//                  ↑ LLM has the context it needs for a coherent slide