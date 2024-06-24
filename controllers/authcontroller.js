import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

import JWT from "jsonwebtoken";

// registratio handling

export const registerController = async (req, res) => {
  try {
    const { name, email, password, age, city, zipcode } = req.body;
    //validation
    if (!name) {
      return res.send({ message: "Name is required" });
    }
    if (!email) {
      return res.send({ message: "Email is required" });
    }
    if (!password) {
      return res.send({ message: "Password is required" });
    }
    if (!age) {
      return res.send({ message: "Phone is required" });
    }
    if (!city) {
      return res.send({ message: "Address is required" });
    }
    if (!zipcode) {
      return res.send({ message: "Answer is required" });
    }

    //check user
    const existingUser = await userModel.findOne({ email });
    //existing user
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already Register please login",
      });
    }
    //register user
    const hashedPassword = await hashPassword(password);
    //save
    const user = await new userModel({
      name,
      email,
      age,
      city,
      password: hashedPassword,
      zipcode,
    }).save();
    res.status(201).send({
      success: true,
      message: "User Register Successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

// login handling

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    //validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login succesfully",
      user: {
        name: user.name,
        email: user.email,
        age: user.age,
        city: user.city,
        zipcode: user.zipcode,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login ",
      error,
    });
  }
};

//test controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};

// Get list of users
export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({ isDeleted: { $ne: true } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error getting users", error });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.userId);
    if (!user || user.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error getting user", error });
  }
};

// Create new user
export const createUser = async (req, res) => {
  try {
    const { name, email, age, city, zipcode, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new userModel({
      name,
      email,
      age,
      city,
      zipcode,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id, name, email, age, city, zipcode } = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { name, email, age, city, zipcode },
      { new: true }
    );
    if (!updatedUser || updatedUser.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

// Patch user
export const patchUser = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;
    const patchedUser = await userModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );
    if (!patchedUser || patchedUser.isDeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(patchedUser);
  } catch (error) {
    res.status(500).json({ message: "Error patching user", error });
  }
};

// Soft delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedUser = await userModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
