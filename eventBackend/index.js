import express, {urlencoded} from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import adminRoute from "../eventBackend/routes/adminRoute.js";
import tagRoute from "../eventBackend/routes/tagRoutes.js"
import eventRoute from "../eventBackend/routes/eventRoutes.js"
import userRoute from "../eventBackend/routes/userRoutes.js"
import eventFlowRoute from "../eventBackend/routes/eventFlowRoute.js"
import clientRoute from "../eventBackend/routes/clientRoute.js"
import apps from "../eventBackend/routes/csvRoutes.js"
import analysis from "../eventBackend/routes/eventAnalysisRoutes.js"
import appss from "../eventBackend/routes/uploadsRoutes.js"
import appsss from "../eventBackend/routes/eventUserUpload.js";
import path from "path";


dotenv.config();


const app = express();

const _dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.use(urlencoded({
    extended: true
}));
const corsOptions = {
    origin: 'http://localhost:3000', // frontend url
    credentials: true // enable setting of cokkies
}

app.use(cors(corsOptions));






// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => console.error('MongoDB connection error:', error));

app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/tag",tagRoute);
app.use("/api/v1/event",eventRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/eventflow",eventFlowRoute);
app.use("/api/v1/client",clientRoute);
app.use("/api/v1/csv",apps);
app.use("/api/v1/analysis",analysis);
app.use("/api/v1/upload",appss);
app.use("/api/v1/eventuserupload",appsss);


app.use(express.static(path.join(_dirname,"/frontend/build")));
app.get('*',(_,res) => {
  res.sendFile(path.resolve(_dirname,"frontend","build","index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});