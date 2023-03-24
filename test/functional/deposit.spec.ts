import User from "../../src/models/User";
import request from "../Request";
import { expect } from "chai";
import dbconnection from "../../src/config/connection";

describe("Account Funding", function () {
  let connection, token, user, sellerToken;

  before(async () => {
    connection = await dbconnection();

    user = await User.create({
      username: "sam",
      password: "password",
      role: "buyer",
    });

    await User.create({
      username: "pete",
      password: "password",
      role: "seller",
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

  it("user with buyer role should be able fund wallet successfully", async function () {
    const response = await request
      .post(`/user/deposit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 20,
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.deposit).to.equal(20);
    expect(response.body.data.username).to.equal(user.username);
  });

  it("user with seller role should not be able to fund wallet", async function () {
    const response = await request
      .post(`/user/deposit`)
      .set("Authorization", `Bearer ${sellerToken}`)
      .send({
        amount: 100,
      });

    expect(response.status).to.equal(403);
    expect(response.body.message).to.equal(
      "You do not have permission to access this route"
    );
  });

  it("should not be able to fund wallet with unacceptable coins", async function () {
    const response = await request
      .post(`/user/deposit`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        amount: 500,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal(
      "Invalid coin. Accepted coins are 5,10,20,50 and 100"
    );
  });
});
