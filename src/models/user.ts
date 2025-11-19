import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
}   

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
},
{
    timestamps: true,
});

export const User = mongoose.model<IUser>("User", UserSchema);