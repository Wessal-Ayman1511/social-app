import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid"



export const fileUpload = () => {

    const storage = diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
            cb(null, nanoid() +  file.originalname)
        }
    })
    
    return multer({storage})
}