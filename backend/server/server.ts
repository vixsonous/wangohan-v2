import express from 'express';
import { router } from './routes';
import cors from 'cors';
const app = express();

app.use("/api", router);

app.listen(3001, () => {
  console.log("Now listening to port 3001!");
}); 