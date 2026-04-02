require('dotenv').config();
console.log("JWT_SECRET loaded:", !!process.env.JWT_SECRET); // logs true or false
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('./models/User');
require('./models/House');
require('./models/Chore');
require('./models/Membership');
require('./models/Notification');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
  })
);

app.use(express.json());

app.use('/api/users',         require('./routes/users'));
app.use('/api/houses',        require('./routes/houses'));
app.use('/api/chores',        require('./routes/chores'));
app.use('/api/memberships',   require('./routes/memberships'));
app.use('/api/notifications', require('./routes/notifications'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Chorebear API is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});