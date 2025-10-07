require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/products");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/products", productRoutes);

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
