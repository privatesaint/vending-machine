import { Router } from "express";
import { login, terminateAllSessions } from "../../controllers/UserController";
import { authorize } from "../../middlewares/Authentication";

const router = Router();
/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login
 *     description: api to log in
 *     tags: [Auth]
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
 *             required: [username, password]
 *             properties:
 *               username:
 *                  type: [string]
 *                  required: true
 *               password:
 *                  type: [string]
 *                  required: true
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {token: ddfjdskdks}
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
router.post("/login", login);

/**
 * @openapi
 * /auth/logout/all:
 *   post:
 *     summary: Log out from all active sessions
 *     description:
 *     tags: [Auth]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *
 *
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data:
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
router.post("/logout/all", authorize, terminateAllSessions);

export default router;
