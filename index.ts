import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
  {
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Express TypeScript server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});