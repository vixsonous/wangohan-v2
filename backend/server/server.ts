import express from 'express';
import { router } from './routes';

const app = express();

app.use("/api", router);

app.listen(3001, () => {
  console.log("Now listening to port 3001!");
}); 