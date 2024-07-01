import multer from "multer";
import { Request } from 'express';

// Config memory type
const storage = multer.memoryStorage();

// Accept just images
const imageFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!file.originalname.match(/\.(JPG|jpg|jpeg|png|gif)$/)) {
        return cb(null, false);
    }
    cb(null, true);
};

const processMultiImageMiddleware = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
}).array('images', 10);

const processSingleImageMiddleware = multer({
    storage: storage,
    fileFilter: imageFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // keep images size < 5 MB
    },
}).single('image');


export { processMultiImageMiddleware, processSingleImageMiddleware };

