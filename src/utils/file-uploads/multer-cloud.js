import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid"
import fs from 'fs'
import path from "path"

export const fileTypes = {
    files: ['application/pdf', 'application/msword'],
    images: ['image/png', 'image/jpg', 'image/jpeg'],
    videos: ['video/mp4']
}

export const cloudUpload = (allowedTypes) => {


    const storage = diskStorage({})

    
    const fileFilter = (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)){
            return cb(new Error("invalid file format!!"), false)
        }
        return cb(null, true)
    }
    return multer({storage, fileFilter})
}