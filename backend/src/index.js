require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 4000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => res.json({ ok: true, message: "API running" }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
