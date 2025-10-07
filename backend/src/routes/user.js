const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcrypt");
const { registerValidator } = require("../middlewares/validators");

// POST /users/create
const SALT_ROUNDS = 12;
router.post("/create", registerValidator, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const userExists = await db.query("SELECT id FROM users WHERE username=$1", [username]);
    if (userExists.rows.length) return res.status(400).json({ ok: false, message: "El usuario ya existe" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query("INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role", [username, hash, role]);
    const user = result.rows[0];
    return res.status(201).json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// POST /users/edit/:id
router.post("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password } = req.body;

    const userExists = await db.query("SELECT id FROM users WHERE id=$1", [id]);
    if (!userExists.rows.length) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await db.query("UPDATE users SET username=$1, password=$2 WHERE id=$3 RETURNING id, username, role", [username, hash, id]);
    const user = result.rows[0];
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

// POST /users/delete
router.post("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const userExists = await db.query("SELECT id FROM users WHERE id=$1", [id]);
    if (!userExists.rows.length) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });

    const result = await db.query("DELETE FROM users WHERE id=$1 RETURNING id", [id]);
    if (!result.rows.length) return res.status(404).json({ ok: false, message: "Usuario no encontrado" });
    return res.status(200).json({ ok: true, message: "Usuario eliminado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Error en server" });
  }
});

module.exports = router;
