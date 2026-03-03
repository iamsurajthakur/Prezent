import multer, {FileFilterCallback} from 'multer'
import { type Request } from 'express'
import { ALLOWED_TYPES } from '@/constant'

const MAX_FILE_SIZE = 10 * 1024 * 1024

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (Object.keys(ALLOWED_TYPES).includes(file.mimetype)){
        cb(null, true)
    } else {
        cb(new Error('Only PDF and DOCX files are allowed.'))
    }
}

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter
})