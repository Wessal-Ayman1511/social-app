// import fs from "fs";
// import { fileTypeFromBuffer } from "file-type";
// import { fileTypes } from "../utils/file-uploads/multer.js";

// export const fileValidation = async (req, res, next) => {
//   const filePath = req.file.path;
//   const buffer = fs.readFileSync(filePath);
//   const type = await fileTypeFromBuffer(buffer);

//   if (!type || !fileTypes.images.includes(type.mime))
//     return next(new Error("Invalid file formal!!"));
//   return next();
// };


// middlewares/validateFiles.js
import fs from "fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { fileTypes } from "../utils/file-uploads/multer.js";
export const validateFiles = (allowedConfig = {}) => {
  return async (req, res, next) => {
    try {
      let files = [];


      if (req.file) {
        files = [{ field: req.file.fieldname, file: req.file }];
 
      }
 


      else if (req.files) {
        if (Array.isArray(req.files)) {

          files = req.files.map(f => ({ field: f.fieldname, file: f }));
        } else if (typeof req.files === "object") {

          files = Object.entries(req.files).flatMap(([field, arr]) =>
            arr.map(f => ({ field, file: f }))
          );
        }
      }

      if (files.length === 0) {
        return next(new Error("No files uploaded!"));
      }


      for (const { field, file } of files) {
        const buffer = await fs.readFile(file.path);
        const type = await fileTypeFromBuffer(buffer);

        const allowedTypes = allowedConfig[field] || [];
  
        if (!type || !allowedTypes.includes(type.mime)) {
          return next(new Error(`Invalid file format for field "${field}"!`));
        }
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
