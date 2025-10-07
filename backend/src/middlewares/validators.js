const { body, validationResult } = require("express-validator");

const registerValidator = [
  body("username").isString().isLength({ min: 3 }).withMessage("username min 3 chars"),
  body("password").isString().isLength({ min: 6 }).withMessage("password min 6 chars"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ ok: false, errors: errors.array() });
    next();
  },
];

const creaProducto = [
  body("name").isString().notEmpty().withMessage("Campo name obligatorio"),
  body("price").isNumeric().withMessage("Campo price debe ser numérico"),
  body("stock").isInt().withMessage("Campo stock debe ser un entero"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ ok: false, errors: errors.array() });
    next();
  },
];

const editaProducto = [
  body("name").optional().isString().notEmpty().withMessage("Campo name obligatorio"),
  body("price").optional().isNumeric().withMessage("Campo price debe ser numérico"),
  body("stock").optional().isInt().withMessage("Campo stock debe ser un entero"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ ok: false, errors: errors.array() });
    next();
  },
];

module.exports = { registerValidator, creaProducto, editaProducto };
