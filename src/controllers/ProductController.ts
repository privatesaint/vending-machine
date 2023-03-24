import { Response, Request, NextFunction } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import ProductService from "../services/Product";

import CreateValidator from "../validators/products/Create";
import UpdateValidator from "../validators/products/Update";
import PurchaseValidator from "../validators/products/Purchase";
import IdValidator from "../validators/Id";
import { JWTUSER } from "../types/JwtUser";

/**
 * @route   GET /products
 * @desc    Get all products
 */
export const index = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await ProductService.getAll();

    return res.status(200).json({
      message: "",
      data: products,
    });
  }
);

/**
 * @route   POST /products
 * @desc    Create products
 */
export const store = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const validatedData = await CreateValidator(req.body);
    validatedData.sellerId = req.user.id;

    const product = await ProductService.create(validatedData);

    return res.status(201).json({
      message: "",
      data: product,
    });
  }
);

/**
 * @route   DELETE /products/:id
 * @desc    Delete a product
 */
export const deleteProduct = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const validatedId = await IdValidator(req.params);

    await ProductService.deleteProduct(validatedId.id, req.user.id);

    return res.status(200).json({
      message: "Product deleted successfully",
      data: {},
    });
  }
);

/**
 * @route   PATCH /products/:id
 * @desc    Update products
 */
export const update = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const [validatedData, validatedId] = await Promise.all([
      UpdateValidator(req.body),
      IdValidator(req.params),
    ]);
    validatedData.sellerId = req.user.id;

    const product = await ProductService.update(validatedId.id, validatedData);

    return res.status(200).json({
      message: "Product updated successfully",
      data: product,
    });
  }
);

/**
 * @route   POST /products/buy
 * @desc    Purchase a product
 */
export const buyItem = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const validatedData = await PurchaseValidator(req.body);
    validatedData.sellerId = req.user.id;

    const product = await ProductService.buyItem(validatedData);

    return res.status(200).json({
      message: "",
      data: product,
    });
  }
);
