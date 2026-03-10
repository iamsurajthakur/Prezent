import pptxgen from "pptxgenjs"
import { supabase } from "./supabase"
import { ALLOWED_TYPES } from "@/constant"

// ── Theme ──
const THEME = {
    primary:    "1E3A5F",  // deep navy
    secondary:  "2E6DA4",  // corporate blue
    accent:     "4A9FD4",  // light blue
    white:      "FFFFFF",
    lightBg:    "F0F4F8",
    textDark:   "1A1A2E",
    textMuted:  "5A6A7A",
}

interface Slide {
    title: string
    bullets: string[]
}

const addTitleSlide = (pres: pptxgen, slide: Slide) => {
    const s = pres.addSlide()

    // Dark navy background
    s.background = { color: THEME.primary }

    // Left accent bar
    s.addShape("rect", {
        x: 0, y: 0, w: 0.18, h: 5.625,
        fill: { color: THEME.accent },
        line: { color: THEME.accent }
    })

    // Title
    s.addText(slide.title, {
        x: 0.5, y: 1.6, w: 9, h: 1.2,
        fontSize: 40, fontFace: "Calibri",
        bold: true, color: THEME.white,
        align: "left", valign: "middle",
        margin: 0
    })

    // Bullets as subtitle lines
    const subtitleText = slide.bullets.map((b, i) => ({
        text: b,
        options: { breakLine: i < slide.bullets.length - 1 }
    }))

    s.addText(subtitleText, {
        x: 0.5, y: 3.0, w: 9, h: 1.8,
        fontSize: 16, fontFace: "Calibri",
        color: THEME.accent, align: "left",
        margin: 0
    })
}

const addContentSlide = (pres: pptxgen, slide: Slide, index: number) => {
    const s = pres.addSlide()

    // Light background
    s.background = { color: THEME.lightBg }

    // Top header bar
    s.addShape("rect", {
        x: 0, y: 0, w: 10, h: 1.0,
        fill: { color: THEME.primary },
        line: { color: THEME.primary }
    })

    // Slide number circle
    s.addShape("ellipse", {
        x: 9.1, y: 0.1, w: 0.7, h: 0.7,
        fill: { color: THEME.accent },
        line: { color: THEME.accent }
    })
    s.addText(String(index), {
        x: 9.1, y: 0.1, w: 0.7, h: 0.7,
        fontSize: 11, fontFace: "Calibri",
        bold: true, color: THEME.white,
        align: "center", valign: "middle",
        margin: 0
    })

    // Title in header bar
    s.addText(slide.title, {
        x: 0.4, y: 0.05, w: 8.5, h: 0.85,
        fontSize: 22, fontFace: "Calibri",
        bold: true, color: THEME.white,
        align: "left", valign: "middle",
        margin: 0
    })

    // Left accent bar for content
    s.addShape("rect", {
        x: 0.4, y: 1.2, w: 0.06, h: 3.8,
        fill: { color: THEME.secondary },
        line: { color: THEME.secondary }
    })

    // Bullets
    const bulletItems = slide.bullets.map((b, i) => ({
        text: b,
        options: {
            bullet: true,
            breakLine: i < slide.bullets.length - 1,
            color: THEME.textDark,
        }
    }))

    s.addText(bulletItems, {
        x: 0.65, y: 1.2, w: 9.0, h: 3.8,
        fontSize: 15, fontFace: "Calibri",
        valign: "top", align: "left",
        paraSpaceAfter: 6,
        margin: 0
    })
}

const addFinalSlide = (pres: pptxgen) => {
    const s = pres.addSlide()
    s.background = { color: THEME.primary }

    s.addShape("rect", {
        x: 0, y: 0, w: 0.18, h: 5.625,
        fill: { color: THEME.accent },
        line: { color: THEME.accent }
    })

    s.addText("Thank You", {
        x: 0.5, y: 2.0, w: 9, h: 1.2,
        fontSize: 44, fontFace: "Calibri",
        bold: true, color: THEME.white,
        align: "left", valign: "middle",
        margin: 0
    })
}

export const generatePPT = async (slides: Slide[], userId: string, jobId: string, mimetype: string): Promise<string> => {
    const pres = new pptxgen()
    pres.layout = "LAYOUT_16x9"

    slides.forEach((slide, index) => {
        if (index === 0) {
            addTitleSlide(pres, slide)
        } else {
            addContentSlide(pres, slide, index)
        }
    })

    addFinalSlide(pres)

    // Get buffer instead of writing to file
    const buffer = await pres.write({ outputType: "nodebuffer" }) as Buffer

    // Upload to Supabase
    const storagePath = `${userId}/uploads/${jobId}.pptx`

    const { error } = await supabase.storage
        .from("uploads") // your bucket name
        .upload(storagePath, buffer, {
        contentType: mimetype,
        upsert: false,
    })

    if (error) throw new Error(`PPT upload failed: ${error.message}`)

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("uploads")
        .createSignedUrl(storagePath, 60 * 60 * 24) // 24 hours

    if (signedUrlError || !signedUrlData?.signedUrl) {
        throw new Error("PPT stored but failed to generate download URL")
    }

    return signedUrlData.signedUrl
}