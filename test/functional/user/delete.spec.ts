import User from "../../../src/models/User";
import request from "../../Request";
import { expect } from "chai";
import dbconnection from "../../../src/config/connection";

describe("Delete User", function () {
  let connection, token;

  before(async () => {
    connection = await dbconnection();

    await User.create({
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

  it("should be able to delete user profile successfully", async function () {
    const response = await request
      .delete(`/user`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
  });

  it("should return not found for deleted profile", async function () {
    const response = await request
      .get(`/user`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal("Invalid Token.");
  });
});
