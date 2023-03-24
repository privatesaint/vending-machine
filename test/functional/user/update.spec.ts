import User from "../../../src/models/User";
import request from "../../Request";
import { expect } from "chai";
import dbconnection from "../../../src/config/connection";

describe("Update User", function () {
  let connection, token, user;

  before(async () => {
    connection = await dbconnection();

    user = await User.create({
      username: "sam",
      password: "password",
      role: "buyer",
    });

    const response = await request.post("/auth/login").send({
      username: "sam",
      password: "password",
    });

    token = response.body.data.token;
  });

  after(async () => {
    await User.deleteMany({});

    await connection.disconnect();
  });

  it("should be able to update username successfully", async function () {
    const response = await request
      .put(`/user`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "sammy",
        role: user.role,
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.username).to.equal("sammy");
    expect(response.body.data.deposit).to.equal(user.deposit);
    expect(response.body.data.role).to.equal(user.role);
  });

  it("should be able to update role successfully", async function () {
    const response = await request
      .put(`/user`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: user.username,
        role: "seller",
      });

    expect(response.status).to.equal(200);
    expect(response.body.data.username).to.equal(user.username);
    expect(response.body.data.role).to.equal("seller");
  });

  it("should not be able to update product with empty data", async function () {
    const response = await request
      .put(`/user`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "",
        role: "",
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Username is required");
  });
});
