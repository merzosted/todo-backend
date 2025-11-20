import mongoose from "mongoose";

export interface IErrorLog extends mongoose.Document {
  message: string;
  stack?: string;
  statusCode: number;
  method: string;
  url: string;
  userId?: string;
  timestamp: Date;
}

const ErrorLogSchema = new mongoose.Schema<IErrorLog>({
  message: { type: String, required: true },
  stack: { type: String },
  statusCode: { type: Number, required: true },
  method: { type: String, required: true },
  url: { type: String, required: true },
  userId: { type: String },
  timestamp: { type: Date, default: Date.now },
});

export const ErrorLog = mongoose.model<IErrorLog>("ErrorLog", ErrorLogSchema);
