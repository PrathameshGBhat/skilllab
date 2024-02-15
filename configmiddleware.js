import express from "express";
const app = express();
const port = 3100;

//configration middleware

const config = {
  active: true,
};

// Configuration Middleware
const auth = (req, res, next) => {
  if (config.active) {
    console.log("Authentication passed");
    next();
  } else {
    console.log("Authentication failed. Need to be renewal");
    res.status(401).send("Authentication failed");
  }
};

app.use(auth);

app.get("/hello", (req, res) => {
  console.log("Call of route hello ");
  res.send("Hello");
});

app.listen(port, () => {
  console.log("Server is woring fine in 3100");
});
