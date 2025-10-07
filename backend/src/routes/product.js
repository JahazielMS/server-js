const express = require("express");
const router = express.Router();
const db = require("../db");
const { authMiddleware, requireAdmin } = require("../middlewares/auth");
const { creaProducto, editaProducto } = require("../middlewares/validators");

// GET /products (public)
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM products ORDER BY id DESC");
    return res.json({ ok: true, products: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// GET /products/:id (public)
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query("SELECT * FROM products WHERE id=$1", [id]);
    return res.json({ ok: true, products: result.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// POST /products (admin)
router.post("/", authMiddleware, requireAdmin, creaProducto, async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const result = await db.query("INSERT INTO products (name, stock, price) VALUES ($1,$2,$3) RETURNING id, name, stock, price", [name, stock || 0, price || 0]);
    return res.status(201).json({ ok: true, product: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// PUT /products/:id (admin)
router.put("/:id", authMiddleware, requireAdmin, editaProducto, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, stock, price } = req.body;
    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) {
      fields.push(`name=$${idx++}`);
      values.push(name);
    }
    if (stock !== undefined) {
      fields.push(`stock=$${idx++}`);
      values.push(stock);
    }
    if (price !== undefined) {
      fields.push(`price=$${idx++}`);
      values.push(price);
    }

    if (!fields.length) {
      return res.status(400).json({ ok: false, message: "No hay campos para actualizar" });
    }

    values.push(id);
    const query = `UPDATE products SET ${fields.join(", ")} WHERE id=$${idx} RETURNING id, name, stock, price`;
    const result = await db.query(query, values);
    if (!result.rows.length) return res.status(404).json({ ok: false, message: "Not found" });
    return res.json({ ok: true, product: result.rows[0] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// DELETE /products/:id (admin)
router.delete("/:id", authMiddleware, requireAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query("DELETE FROM products WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length) return res.status(404).json({ ok: false, message: "Not found" });
    return res.json({ ok: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

module.exports = router;
