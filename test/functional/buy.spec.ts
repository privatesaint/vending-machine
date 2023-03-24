import User from "../../src/models/User";
import Product from "../../src/models/Product";
import request from "../Request";
import { expect } from "chai";
import dbconnection from "../../src/config/connection";

describe("Buy Product", function () {
  let connection, token, product, sellerToken;

  before(async () => {
    connection = await dbconnection();

    await User.create({
      username: "sam",
      password: "password",
      role: "buyer",
      deposit: 200,
    });

    const seller = await User.create({
      username: "pete",
      password: "password",
      role: "seller",
    });

    product = await Product.create({
      productName: "fanta",
      sellerId: seller.id,
      amountAvailable: 25,
      cost: 10,
    });

    const buyerResp = await request.post("/auth/login").send({
      username: "sam",
      password: "password",
    });

    const sellerresponse = await request.post("/auth/login").send({
      username: "pete",
      password: "password",
    });

    token = buyerResp.body.data.token;
    sellerToken = sellerresponse.body.data.token;
  });

  after(async () => {
    await User.deleteMany({});

    await connection.disconnect();
  });

  it("user with buyer role should be able purchase item successfully", async function () {
    const response = await request
      .post(`/products/buy`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 2,
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.totalCost).to.equal(2 * product.cost);
    expect(response.body.data.balance).to.deep.equal([100, 50, 20, 10]);
    expect(response.body.data.product.productName).to.equal(
      product.productName
    );
  });

  it("user with seller role should not  be able to buy item", async function () {
    const response = await request
      .post(`/products/buy`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        productId: product.id,
        quantity: 2,
      });

    expect(response.status).to.equal(403);
    expect(response.body.message).to.equal(
      "You do not have permission to access this route"
    );
  });

  it("should not be able to purchase more than the available product", async function () {
    const response = await request
      .post(`/products/buy`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 25,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      "Requested quantity is not available at the moment."
    );
  });

  it("should return not found for product that does not exist", async function () {
    const response = await request
      .post(`/products/buy`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: "641b79f5851dab7d1134ca46",
        quantity: 20,
      });

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal("Product not found");
  });

  it("should not be able to buy item with Insuffient balance", async function () {
    const response = await request
      .post(`/products/buy`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        productId: product.id,
        quantity: 20,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Insuffient balance");
  });
});
