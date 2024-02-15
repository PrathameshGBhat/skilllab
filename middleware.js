import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3100;

// middlewares
app.use(express.json());
app.use(bodyParser.json());

app.get("/hello", (req, res) => {
  console.log("Call of route hello ");
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server is woring fine in 3100");
});
