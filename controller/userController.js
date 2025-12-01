import { JWT_SECRET } from "../config/config.js";
import User from "../models/user.js";
import jwt from 'jsonwebtoken';




export const registerUser = async (req, res) => {
    try {
    

const {password,username,email} = req.body;


const isUserExists = await User.findOne({
    $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
    ]
});

if (isUserExists) {
    return res.status(400).send("email or username already exists");
}

const userInfo = new User({
    username: username,
    password: password,
    email: email
});

await userInfo.save();
userInfo.password = undefined;

return res.status(201).send(userInfo);



    } catch (err) {
        console.log("error at registerUser", err.message);
        res.send("something went wrong" + err.message);
    }
};



export const LoginUser = async (req, res) => {
  try {
    // Fixed destructuring
    const { email, password } = req.body;

    const isUserExists = await User.findOne({ email: email.toLowerCase() })
      .select('+password');

    if (!isUserExists) {
      return res.status(400).send("Invalid Email please provide a valid email");
    }

    // Password checking
    const isPasswordCorrect = await isUserExists.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).send("Incorrect password");
    }

const expiresIn = 7 * 24 * 60 * 60; // 7 days

const token = jwt.sign({ _id: isUserExists._id }, JWT_SECRET, {
  expiresIn
});

res.cookie('token', token, {
  httpOnly: true,
  secure: false,
  maxAge: expiresIn * 1000
});

isUserExists.password = undefined;

res.status(200).send({ ...isUserExists.toJSON(), expiresIn });

  } catch (err) {
    console.log("error at loginUser", err);
    res.status(400).send(err.message);
  }
};
