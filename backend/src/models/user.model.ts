import { Schema, model } from "mongoose";

export interface User {
  id: string;
  email: string;
  name: string;
  address: string;
  password: string;
  isAdmin: boolean;
}

export const userSchema = new Schema<User>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const userModel = model<User>("user", userSchema);
