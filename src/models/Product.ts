import mongoose from "mongoose";
import User from "./User";

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    amountAvailable: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default mongoose.model("products", schema);
