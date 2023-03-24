import mongoose from "mongoose";
import User from "./User";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    ip: {
      type: String,
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model("user_sessions", schema);
