// routes/csvRoutes.js
import express from 'express';
import multer from 'multer';
import path from "path";
import bodyParser from 'body-parser';
import { eventUploadUser } from '../controllers/eventUploadUser.js';


  
const appsss = express();

appsss.use(bodyParser.urlencoded({extended: true}));

// To get the directory name in ES modules, use 'import.meta.url'
const __dirname = path.dirname(new URL(import.meta.url).pathname);

appsss.use(express.static(path.resolve(__dirname,'public')));

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/uploads')
    },
    filename: (req,file,cb) => {
        cb(null,file.originalname)
    }
});

var upload = multer({storage: storage});
appsss.post('/importusers', upload.single('file'),eventUploadUser);


export default appsss;


