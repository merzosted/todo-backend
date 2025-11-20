/**
 * Authentication Controller
 * Handles user registration, login, and password reset functionality
 */

import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/user.js";
import nodemailer from "nodemailer";

/**
 * User Signup
 * Creates a new user account with hashed password and returns JWT token
 * @route   POST /api/auth/signup
 * @access  Public
 */
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract user data from request body
    const { name, email, password } = req.body;

    // Validate that all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if user with this email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password using bcrypt with salt rounds of 10
    const hashed = await bcrypt.hash(password, 10);

    // Create new user in database with hashed password
    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    // Generate JWT token with user ID and email, expires in 7 days
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Return success response with token and user data (excluding password)
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    // Pass any errors to the global error handler
    next(error);
  }
};

/**
 * User Login
 * Authenticates user credentials and returns JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract credentials from request body
    const { email, password } = req.body;

    // Validate that both email and password are provided
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Find user by email in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Compare provided password with hashed password in database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token for authenticated user
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Return success response with token and user data
    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    // Pass errors to global error handler
    next(error);
  }
};

/**
 * Forgot Password
 * Generates a reset token and sends password reset email to user
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Generate a random reset token (32 bytes)
    const resetToken = crypto.randomBytes(32).toString("hex");
    
    // Hash the token before storing in database for security
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    // Set token expiration time to 10 minutes from now
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Save user with reset token and expiration
    await user.save();

    // Create password reset URL with the unhashed token
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Configure email transporter using nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose email message with reset link
    const message = `You requested a password reset. Click this link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.`;

    try {
      // Send password reset email
      await transporter.sendMail({
        from: `Todo App <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        text: message,
      });

      res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (emailError) {
      // If email fails, clear the reset token from database
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      return res.status(500).json({ success: false, message: "Email could not be sent" });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Reset Password
 * Validates reset token and updates user password
 * @route   PUT /api/auth/reset-password/:resetToken
 * @access  Public
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Hash the token from URL to match with stored hashed token
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    // Find user with matching token that hasn't expired
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }, // Token must not be expired
    });

    // If no user found or token expired, return error
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(req.body.password, 10);
    
    // Clear reset token fields from database
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new JWT token for automatic login after password reset
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    // Return success with new token
    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token,
    });
  } catch (error) {
    next(error);
  }
};
