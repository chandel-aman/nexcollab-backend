const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const User = require("../models/user");

const registerSchema = Joi.object({
  username: Joi.string().min(3).required(),
  email: Joi.string()
    .min(6)
    .required()
    .email({ tlds: { allow: false } }),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});
const loginSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .required()
    .email({ tlds: { allow: false } }),
  password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
});

//SignUp User
const signup = async (req, res) => {
  //CHECK IF Email ID ALREADY EXISTS
  delete req.body.confirmPassword;
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(400).send({ message: "Email Already Exists" });
    return;
  }

  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) {
    res.status(400).send({ message: "Username Already Exists" });

    return;
  }

  //HASHING THE PASSWORD

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    projects: [],
  });

  try {
    //VALIDATION OF USER INPUTS
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(500).send({ message: error });
    } else {
      //THE USER IS ADDED
      await user.save();
      //CREATE TOKEN
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send({
        token: token,
        userId: user._id,
        username: user.username,
        email: user.email,
      });
    }
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

//SIGNIN USER
const login = async (req, res, next) => {
  //CHECKING IF EMAIL EXISTS
  let user;
  try {
    user = await User.findOne({ email: req.body.email });
  } catch (error) {
    console.log(error);
  }
  if (!user) {
    res.status(400).send({ message: 'Email doesn"t exist' });
    return;
  }
  //Validating User Password
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    res.status(400).send({ message: "Incorrect Password !!!" });
    return;
  }

  try {
    const { error } = await loginSchema.validateAsync(req.body);

    if (error) {
      res.status(400).send({ message: error });
      return;
    } else {
      //CREATE TOKEN
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_PRIVATE_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send({
        token: token,
        userId: user._id,
        username: user.username,
        email: user.email,
      });
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
};
//Finding User Information Using ID
const getUser = async (req, res) => {
  try {
    const results = await User.findById(req.params.id).exec();
    res.status(200).send({ results });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.getUser = getUser;
// exports.updateUser = updateUser;
exports.signup = signup;
exports.login = login;
