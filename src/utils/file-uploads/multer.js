import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid"
import fs from 'fs'
import path from "path"

export const fileTypes = {
    files: ['application/pdf', 'application/msword'],
    images: ['image/png', 'image/jpg', 'image/jpeg'],
    videos: ['video/mp4']
}

export const fileUpload = (allowedTypes, folder) => {


    const storage = diskStorage({
        destination: (req, file, cb) => {
            const fullPath = path.resolve(`${folder}/${req.authUser._id}`)
            fs.mkdirSync(fullPath, {recursive:true})
            cb(null, `${folder}/${req.authUser._id}`)
        },
        filename: (req, file, cb) => {
            cb(null, nanoid() +  file.originalname)
        }
    })

    
    const fileFilter = (req, file, cb) => {
        if (!allowedTypes.includes(file.mimetype)){
            return cb(new Error("invalid file format!!"), false)
        }
        return cb(null, true)
    }
    return multer({storage, fileFilter})
}