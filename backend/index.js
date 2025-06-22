import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import routes from './routes/index.js';
import dbConnect from './config/Database.js';

dotenv.config();
dbConnect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health-check", (req, res) => {
  res.status(200).json({ message: `Healthy Server - Worker ${process.pid}` });
});

routes(app); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
