import path from "path";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = app.listen(8000, () => {
  console.log("Example app listening on port 8000!");
});

export { app, server };
