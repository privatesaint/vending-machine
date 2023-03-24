import User from "../models/User";
import UserSession from "../models/UserSession";
import { InterfaceCreateUser } from "../types/users/create.dto";
import { InterfaceUpdateUser } from "../types/users/update.dto";
import ErrorHandler from "../utils/ErrorHandler";

class UserService {
  /**
   * @description Login
   * @param {*} username
   * @param {*} password
   */
  static async login(data: { username: string; password: string; ip: string }) {
    const { username, password, ip } = data;
    const dbuser = await User.findOne({ username });

    if (!dbuser) {
      throw new ErrorHandler("Invalid username/password", 401);
    }

    const checkedPassword = await dbuser.comparePassword(password);

    if (!checkedPassword) {
      throw new ErrorHandler("Invalid username/password", 401);
    }

    let message;
    // check if there is active session
    const activeSession = await UserSession.findOne({ userId: dbuser.id });
    if (activeSession) {
      message = "There is already an active session using your account";
    }

    const token = dbuser.generateJwtToken();

    // store the new user generated token
    await UserSession.create({
      userId: dbuser.id,
      ip,
      token,
    });

    return { token, message };
  }

  /**
   * delete user active sessions
   * @param id
   */
  static async logOutAllSessions(id: string) {
    return UserSession.deleteMany({ userId: id });
  }

  /**
   * Get loggedIn user data
   * @returns
   */
  static async currentUser(id: string) {
    return this.findOne(id);
  }

  /**
   * create new user
   * @returns
   */
  static async create(data: InterfaceCreateUser) {
    return User.create({
      username: data.username,
      password: data.password,
      role: data.role,
    });
  }

  /**
   * Update user
   * @param id
   * @param value
   * @returns
   */
  static async update(id: string, data: InterfaceUpdateUser) {
    const user = await this.findOne(id);

    user.username = data.username;
    user.role = data.role;

    return user.save();
  }

  /**
   * Get single user
   * @param id
   */
  static async findOne(id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    return user;
  }

  /**
   * Delete user
   * @param id
   */
  static async deleteAccount(id: string) {
    await Promise.all([
      User.deleteOne({ _id: id }),
      this.logOutAllSessions(id),
    ]);
  }

  /**
   * fund user wallet
   * @param id
   */
  static async fundWallet(data: { amount: number; userId: string }) {
    return User.findOneAndUpdate(
      { _id: data.userId },
      { $inc: { deposit: data.amount } },
      { new: true }
    );
  }

  /**
   * reset user wallet
   * @param id
   */
  static async resetWallet(id: string) {
    return User.findOneAndUpdate({ _id: id }, { deposit: 0 }, { new: true });
  }
}

export default UserService;
