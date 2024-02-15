import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.json());

const port = 3100;

const mongoURI =
  "mongodb+srv://prathamesh:prathamesh@cluster0.vmpfv4s.mongodb.net/";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on("error", console.error.bind(console, "mongoose connection error"));

db.once("open", () => {
  console.log("MongoDB connected");
});

const authorSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Author = mongoose.model("Author", authorSchema);

const blogSchema = new mongoose.Schema({
  blogTitle: String,
  blogContent: String,
  authorId: mongoose.Schema.Types.ObjectId,
});

const Blog = mongoose.model("Blog", blogSchema);

const validateAuthorInput = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  next();
};

app.post("/api/register", validateAuthorInput, async (req, res) => {
  try {
    const { username, password } = req.body;
    const newAuthor = new Author({ username, password });
    await newAuthor.save();
    res.json({ message: "Author registered successfully" });
  } catch (error) {
    console.error("Error registering author", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/login", validateAuthorInput, async (req, res) => {
  try {
    const { username, password } = req.body;
    const author = await Author.findOne({ username, password });
    if (author) {
      res.json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error logging in", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    const { blogTitle, blogContent, authorId } = req.body;
    const newBlog = new Blog({ blogTitle, blogContent, authorId });
    await newBlog.save();
    res.json({ message: "Blog created successfully" });
  } catch (error) {
    console.error("Error creating blog", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const validateAuthorId = (req, res, next) => {
  const authorId = req.params.authorId;
  if (!mongoose.Types.ObjectId.isValid(authorId)) {
    return res.status(400).json({ error: "Invalid author ID" });
  }
  next();
};

app.get("/api/blogs/:authorId", validateAuthorId, async (req, res) => {
  try {
    const authorId = req.params.authorId;
    const blogs = await Blog.find({
      authorId: mongoose.Types.ObjectId(authorId),
    });
    res.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs by author ID", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log("server is listening");
});
