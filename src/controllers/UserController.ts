import { Response, Request, NextFunction } from "express";
import catchAsyncError from "../middlewares/catchAsyncError";
import { UserService } from "../services";
import CreateValidator from "../validators/user/Create";
import UpdateValidator from "../validators/user/Update";
import DepositValidator from "../validators/user/Deposit";
import LoginValidator from "../validators/Login";
import { JWTUSER } from "../types/JwtUser";

/**
 * @route   POST /auth/login
 * @desc    Account Authentication
 */
export const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = await LoginValidator(req.body);
    validatedData.ip = req.ip;

    const response = await UserService.login(validatedData);

    return res.status(200).json({
      message: "",
      data: response,
    });
  }
);

/**
 * @route   POST /auth/logout/all
 * @desc   Sign out from all active session
 */
export const terminateAllSessions = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    await UserService.logOutAllSessions(req.user.id);

    return res.status(200).json({
      message: "You have successfully logged out from all sessions",
    });
  }
);

/**
 * @route   GET /user/me
 * @desc    Get single user
 */
export const getUserProfile = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const user = await UserService.currentUser(req.user.id);

    return res.status(200).json({
      message: "",
      data: user,
    });
  }
);

/**
 * @route   POST /user
 * @desc    Create user
 */
export const store = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const validatedData = await CreateValidator(req.body);

    const user = await UserService.create(validatedData);

    return res.status(201).json({
      message: "",
      data: user,
    });
  }
);

/**
 * @route   DELETE /user
 * @desc    Delete a user account
 */
export const deleteProfile = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    await UserService.deleteAccount(req.user.id);

    return res.status(200).json({
      message: "Account deleted successfully",
      data: {},
    });
  }
);

/**
 * @route   PUT /user
 * @desc    Update user
 */
export const update = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const validatedData = await UpdateValidator(req.body);

    const user = await UserService.update(req.user.id, validatedData);

    return res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  }
);

/**
 * @route   POST /user/deposit
 * @desc    Fund wallet
 */
export const fundWallet = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const validatedData = await DepositValidator(req.body);
    validatedData.userId = req.user.id;

    const user = await UserService.fundWallet(validatedData);

    return res.status(200).json({
      message: "",
      data: user,
    });
  }
);

/**
 * @route   POST /user/reset
 * @desc    Reset user wallet
 */
export const resetWallet = catchAsyncError(
  async (
    req: Request & { user: JWTUSER },
    res: Response,
    next: NextFunction
  ) => {
    const user = await UserService.resetWallet(req.user.id);

    return res.status(200).json({
      message: "",
      data: user,
    });
  }
);
