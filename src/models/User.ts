import mongoose, { Model } from "mongoose";
import { RoleType } from "../types/users/roletype";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface IUser {
  username: string;
  password: string;
  role: RoleType;
  deposit: number;
  id: string;
}

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
  generateJwtToken(): Promise<string>;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const Schema = mongoose.Schema;

const schema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: RoleType,
      required: true,
    },
    deposit: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

schema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await bcrypt.hash(this.get("password"), 10);
    this.set("password", hashed);
  }
  done();
});

schema.methods.generateJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "2h",
    }
  );
};

schema.methods.comparePassword = async function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser, UserModel>("users", schema);
