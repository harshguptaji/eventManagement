// routes/csvRoutes.js
import express from 'express';
import multer from 'multer';
import path from "path";
import bodyParser from 'body-parser';
import { uploadUser } from '../controllers/UploadsController.js';

  
const appss = express();

appss.use(bodyParser.urlencoded({extended: true}));

// To get the directory name in ES modules, use 'import.meta.url'
const __dirname = path.dirname(new URL(import.meta.url).pathname);

appss.use(express.static(path.resolve(__dirname,'public')));

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/uploads')
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname)
    }
});

var upload = multer({storage: storage});
appss.post('/importuser', upload.single('file'),uploadUser);


export default appss;


