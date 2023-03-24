import User from "../../../src/models/User";
import request from "../../Request";
import { expect } from "chai";
import dbconnection from "../../../src/config/connection";

describe("Create User", function () {
  let connection;

  before(async () => {
    connection = await dbconnection();
  });

  after(async () => {
    await User.deleteMany({});

    await connection.disconnect();
  });

  it("should be able to create user with role buyer successfully", async function () {
    const response = await request.post("/user").send({
      username: "saint",
      password: "password",
      role: "buyer",
    });

    expect(response.status).to.equal(201);
    expect(response.body.data.username).to.equal("saint");
    expect(response.body.data.deposit).to.equal(0);
    expect(response.body.data.role).to.equal("buyer");
  });

  it("should be able to create user with role seller successfully", async function () {
    const response = await request.post("/user").send({
      username: "josh",
      password: "password",
      role: "seller",
    });

    expect(response.status).to.equal(201);
    expect(response.body.data.username).to.equal("josh");
    expect(response.body.data.role).to.equal("seller");
  });

  it("should return validation error for duplicate username", async function () {
    const response = await request.post("/user").send({
      username: "josh",
      password: "password",
      role: "seller",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Username already exist!");
  });

  it("should return validation error for missing required field", async function () {
    const response = await request.post("/user").send({
      username: "",
      password: "password",
      role: "seller",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Username is required");
  });

  it("should return validation error for invalid role type", async function () {
    const response = await request.post("/user").send({
      username: "josh",
      password: "password",
      role: "sell",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Invalid role value");
  });

  it("should return validation error for password less than 8 characters", async function () {
    const response = await request.post("/user").send({
      username: "john",
      password: "doe",
      role: "seller",
    });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal("Password can not be less than 8");
  });
});
