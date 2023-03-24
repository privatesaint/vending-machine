import { Response, Request, NextFunction } from "express";
import { capitalizeFirstLetter } from "../utils/helper";

export default (err, req: Request, res: Response, next: NextFunction) => {
  const error = { ...err };
  error.statusCode = err.statusCode || 500;

  // handle validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: err.message,
    });
  }

  // handle Mongo duplicate error
  if (err.name === "MongoServerError" && err.code === 11000) {
    const [fieldName] = Object.keys(err.keyValue);

    return res.status(400).json({
      message: `${capitalizeFirstLetter(fieldName)} already exist!`,
    });
  }

  // handle invalid mongo id
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid Id value",
    });
  }

  error.message = err.message || "Internal Server Error.";

  return res.status(error.statusCode).json({
    message: error.message,
  });
};
