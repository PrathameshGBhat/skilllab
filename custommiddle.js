import express from "express";
const app = express();
const port = 3100;

//custom middleware
const log1 = (req, res, next) => {
  console.log("Middleware i is exceuted");
  next();
};

const log2 = (req, res, next) => {
  console.log("Middleware 2 is exceuted");
  next();
};

app.use(log1);
app.use(log2);

app.get("/hello", (req, res) => {
  console.log("Call of route hello ");
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server is woring fine in 3100");
});
