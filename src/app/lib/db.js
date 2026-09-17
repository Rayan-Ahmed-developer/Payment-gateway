import mongoose from "mongoose";

console.log("URI:", process.env.MONGODB_URI);
console.log("URL:", process.env.MONGODB_URL);

const MONGODB_URL = process.env.MONGODB_URL;
let cached = global.mongoose || (global.mongoose = { conn: null, promise: null });

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}