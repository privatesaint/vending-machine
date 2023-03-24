import User from "../../../src/models/User";
import request from "../../Request";
import { expect } from "chai";
import dbconnection from "../../../src/config/connection";

describe("Get User Profile", function () {
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

  it("should be able to get user profile", async function () {
    const response = await request
      .get(`/user`)
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.data.username).to.equal(user.username);
    expect(response.body.data.deposit).to.equal(user.deposit);
    expect(response.body.data.role).to.equal(user.role);
  });
});
