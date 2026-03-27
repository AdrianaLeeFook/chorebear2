const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "http://localhost:5173" })); // Vite runs on 5173
app.use(express.json());

// Routes will go here later
// app.use("/api/users", require("./routes/users"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Chorebear API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});