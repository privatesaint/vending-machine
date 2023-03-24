import { Router } from "express";
import * as UserController from "../../controllers/UserController";
import { authorize, hasRole } from "../../middlewares/Authentication";

const router = Router();

/**
 * @openapi
 * /user:
 *   get:
 *     summary: LoggedIn User Profile
 *     description: Get user profile
 *     tags: [USER]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *
 *
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b6fae4fcf1a2cc0ff7e0b","username":"saint","password":"$2a$10$9uXLl1dxCwXKSLYaMqLU5.uNB1S6xtTzyidrdri/1qSKTntLl7qcW","role":"buyer","deposit":0,"createdAt":"2023-03-22T21:14:22.799Z","updatedAt":"2023-03-23T20:36:09.397Z","id":"641b6fae4fcf1a2cc0ff7e0b"}
 *              message: ""
 *
 *       400:
 *         description: bad request
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       500:
 *         description: internal server error
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 */
router.get("/", authorize, UserController.getUserProfile);

/**
 * @openapi
 * /user:
 *   post:
 *     summary: Create user
 *     description: api to create user
 *     tags: [USER]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *
 *     requestBody:
 *
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username:
 *                  type: [string]
 *                  required: true
 *               password:
 *                  type: [string]
 *                  required: true
 *               role:
 *                  type: [string]
 *                  enum: [buyer, seller]
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b6fae4fcf1a2cc0ff7e0b","username":"saint","password":"$2a$10$9uXLl1dxCwXKSLYaMqLU5.uNB1S6xtTzyidrdri/1qSKTntLl7qcW","role":"buyer","deposit":0,"createdAt":"2023-03-22T21:14:22.799Z","updatedAt":"2023-03-23T20:36:09.397Z","id":"641b6fae4fcf1a2cc0ff7e0b"}
 *              message: ""
 *
 *       400:
 *         description: bad request
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       500:
 *         description: internal server error
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 */
router.post("/", UserController.store);

/**
 * @openapi
 * /user/deposit:
 *   post:
 *     summary: Fund wallet
 *     description: api to fund wallet
 *     tags: [USER]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *
 *     requestBody:
 *
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount]
 *             properties:
 *               amount:
 *                  type: number
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b6fae4fcf1a2cc0ff7e0b","username":"saint","password":"$2a$10$9uXLl1dxCwXKSLYaMqLU5.uNB1S6xtTzyidrdri/1qSKTntLl7qcW","role":"buyer","deposit":100,"createdAt":"2023-03-22T21:14:22.799Z","updatedAt":"2023-03-23T20:36:09.397Z","id":"641b6fae4fcf1a2cc0ff7e0b"}
 *              message: ""
 *
 *       400:
 *         description: bad request
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       500:
 *         description: internal server error
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 */
router.post("/deposit", authorize, hasRole("buyer"), UserController.fundWallet);

/**
 * @openapi
 * /user/reset:
 *   post:
 *     summary: Reset wallet
 *     description: api to reset wallet
 *     tags: [USER]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b6fae4fcf1a2cc0ff7e0b","username":"saint","password":"$2a$10$9uXLl1dxCwXKSLYaMqLU5.uNB1S6xtTzyidrdri/1qSKTntLl7qcW","role":"buyer","deposit":0,"createdAt":"2023-03-22T21:14:22.799Z","updatedAt":"2023-03-23T20:36:09.397Z","id":"641b6fae4fcf1a2cc0ff7e0b"}
 *              message: ""
 *
 *       400:
 *         description: bad request
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       500:
 *         description: internal server error
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 */
router.post("/reset", authorize, hasRole("buyer"), UserController.resetWallet);

/**
 * @openapi
 * /user:
 *   put:
 *     summary: Update product
 *     description: api to update product
 *     tags: [USER]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *     parameters:
 *
 *       - name: id
 *         in: path
 *         description: product id
 *         required: true
 *
 *     requestBody:
 *
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, role]
 *             properties:
 *               username:
 *                  type: [string]
 *                  required: true
 *               role:
 *                  type: [string]
 *                  enum: [buyer, seller]
 *
 *
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b6fae4fcf1a2cc0ff7e0b","username":"saint","password":"$2a$10$9uXLl1dxCwXKSLYaMqLU5.uNB1S6xtTzyidrdri/1qSKTntLl7qcW","role":"buyer","deposit":0,"createdAt":"2023-03-22T21:14:22.799Z","updatedAt":"2023-03-23T20:36:09.397Z","id":"641b6fae4fcf1a2cc0ff7e0b"}
 *              message: ""
 *
 *       400:
 *         description: bad request
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       500:
 *         description: internal server error
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 */
router.put("/", authorize, UserController.update);

/**
 * @openapi
 * /user:
 *   delete:
 *     summary: Delete account
 *     description: api for user to delete their account
 *     tags: [USER]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *     parameters:
 *
 *       - name: id
 *         in: path
 *         description: product id
 *         required: true
 *
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       400:
 *         description: bad request
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 *       500:
 *         description: internal server error
 *         content:
 *           application/json:
 *             example:
 *              data: {}
 *              message: ""
 *
 */
router.delete("/", authorize, UserController.deleteProfile);

export default router;
