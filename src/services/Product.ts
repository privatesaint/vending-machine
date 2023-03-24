import Product from "../models/Product";
import { InterfaceCreateProduct } from "../types/products/create.dto";
import { InterfaceUpdateProduct } from "../types/products/update.dto";
import ErrorHandler from "../utils/ErrorHandler";
import UserService from "./User";

class ProductService {
  /**
   * Get all products
   * @returns
   */
  static async getAll() {
    return Product.find();
  }

  /**
   * create new product
   * @returns
   */
  static async create(data: InterfaceCreateProduct) {
    // check if the seller already has an item with the same name before
    const product = await Product.findOne({
      productName: data.productName,
      sellerId: data.sellerId,
    });
    if (product) {
      throw new ErrorHandler("You have a product with same name", 400);
    }

    return Product.create({
      productName: data.productName,
      amountAvailable: data.amountAvailable,
      cost: data.cost,
      sellerId: data.sellerId,
    });
  }

  /**
   * Update product
   * @param id
   * @param data
   * @returns
   */
  static async update(id: string, data: InterfaceUpdateProduct) {
    const [product, existedProduct] = await Promise.all([
      this.findOne(id, data.sellerId),
      Product.findOne({
        productName: data.productName,
        sellerId: data.sellerId,
      }),
    ]);

    // check if seller has a product with the same name with the payload.
    if (existedProduct && existedProduct.id !== product.id) {
      throw new ErrorHandler("You have a product with same name", 400);
    }

    product.productName = data.productName;
    product.amountAvailable = data.amountAvailable;
    product.cost = data.cost;

    return product.save();
  }

  /**
   * Get single product
   * @param id
   */
  static async findOne(id: string, sellerId: string) {
    const product = await Product.findOne({ _id: id, sellerId });

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    return product;
  }

  /**
   * Delete product
   * @param id
   * @param userId
   */
  static async deleteProduct(id: string, userId: string) {
    await this.findOne(id, userId);

    return Product.deleteOne({ _id: id });
  }

  /**
   * Delete product
   * @param id
   * @param userId
   */
  static async buyItem(data: {
    productId: string;
    quantity: number;
    sellerId: string;
  }) {
    const [product, user] = await Promise.all([
      Product.findOne({ _id: data.productId }),
      UserService.findOne(data.sellerId),
    ]);

    // check if product exist
    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    // check if available product is zero
    if (product.amountAvailable === 0) {
      throw new ErrorHandler("Out of stock", 400);
    }

    // check if the available quantity is up to the request quantity by the user
    if (product.amountAvailable < data.quantity) {
      throw new ErrorHandler(
        "Requested quantity is not available at the moment.",
        400
      );
    }

    const totalCost = data.quantity * product.cost;

    // check total cost of items against buyer balance
    if (user.deposit < totalCost) {
      throw new ErrorHandler("Insuffient balance", 400);
    }

    product.amountAvailable -= data.quantity;
    await product.save();

    user.deposit -= totalCost;
    await user.save();

    const balance = this.calculateChange(user.deposit);
    return {
      totalCost,
      balance,
      product,
    };
  }

  /**
   * handles balance calculation and transformation into coins
   * @param balance
   */
  static calculateChange(balance: number) {
    const change = [];
    const coinDenominations = [100, 50, 20, 10, 5];
    for (let i = 0; i < coinDenominations.length; i++) {
      const coin = coinDenominations[i];
      while (balance >= coin) {
        change.push(coin);
        balance -= coin;
      }
    }

    return change;
  }
}

export default ProductService;
