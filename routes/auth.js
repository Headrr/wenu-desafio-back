const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Favorito = require("../models/Favorito");

// constraseña
const bcrypt = require("bcrypt");

// validation
const Joi = require("@hapi/joi");

const schemaRegister = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(1024).required(),
});

const schemaFavorito = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  id: Joi.string().required(),
  name: Joi.string().required(),
  status: Joi.string().required(),
  gender: Joi.string().required(),
  image: Joi.string().required(),
});

router.post("/register", async (req, res) => {
  const { error } = schemaRegister.validate(req.body);

  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const isEmailExist = await User.findOne({ email: req.body.email });
  if (isEmailExist) {
    return res.status(400).json({ error: "Email ya registrado" });
  }

  // hash contraseña
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    email: req.body.email,
    password: password,
  });
  try {
    const savedUser = await user.save();
    res.json({
      error: null,
      data: savedUser,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.post("/login", async (req, res) => {
  // validaciones
  const { error } = schemaLogin.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).json({ error: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ error: "contraseña no válida" });

  const token = jwt.sign(
    {
      name: user.name,
      id: user._id,
    },
    process.env.TOKEN_SECRET
  );

  res.header("auth-token", token).json({
    error: null,
    data: { token },
  });
});

router.post("/nuevo", async (req, res) => {
  const { error } = schemaFavorito.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const idExist = await Favorito.findOne({
    id: req.body.id,
    email: req.body.email,
  });
  if (idExist) {
    return res.status(400).json({ error: "Id ya registrado para el usuario" });
  }
  const favorito = new Favorito({
    email: req.body.email,
    id: req.body.id,
    name: req.body.name,
    status: req.body.status,
    gender: req.body.gender,
    image: req.body.image,
  });
  try {
    const savedFavorito = await favorito.save();
    res.json({
      error: null,
      data: savedFavorito,
    });
  } catch (error) {
    res.json({ error });
  }
});

router.get("/favMail/:mails", async (req, res) => {
  const email = req.params.mails;
  try {
    const notaDb = await Favorito.find({ email: `${email}` });
    res.json(notaDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error,
    });
  }
});

router.delete("/favorito/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const notaDb = await Favorito.findByIdAndDelete({ _id });
    if (!notaDb) {
      return res.status(400).json({
        mensaje: "No se encontró el id indicado",
        error,
      });
    }
    res.json(notaDb);
  } catch (error) {
    return res.status(400).json({
      mensaje: "Ocurrio un error",
      error,
    });
  }
});
module.exports = router;
