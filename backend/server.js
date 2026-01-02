import express from "express";

const app = express();
const PORT = 3001;
app.get("/", (req, res) => {
  res.send("backend server is runnung");
});
app.listen(PORT, () => {
  console.log(`server started on http:/localhost:${PORT}`);
});
