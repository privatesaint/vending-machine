import { Router } from "express";
import * as ProductController from "../../controllers/ProductController";
import { authorize, hasRole } from "../../middlewares/Authentication";

const router = Router();

/**
 * @openapi
 * /products:
 *   get:
 *     summary: Returns list of all products
 *     description: Get paginated product data
 *     tags: [PRODUCT]
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
 *              data: [{"_id":"641b79f5851dab7d1134ca46","sellerId":"641b72d131746a248b160976","amountAvailable":43,"cost":20,"productName":"Coke","createdAt":"2023-03-22T21:58:13.701Z","updatedAt":"2023-03-23T20:34:52.038Z","id":"641b79f5851dab7d1134ca46"}]
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
router.get("/", ProductController.index);

/**
 * @openapi
 * /products:
 *   post:
 *     summary: Create product
 *     description: api to create product
 *     tags: [PRODUCT]
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
 *             required: [productName, amountAvailable, cost]
 *             properties:
 *               productName:
 *                  type: [string]
 *                  required: true
 *               amountAvailable:
 *                  type: [string]
 *                  required: true
 *               cost:
 *                  type: [number]
 *                  required: true
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b79f5851dab7d1134ca46","sellerId":"641b72d131746a248b160976","amountAvailable":43,"cost":20,"productName":"Coke","createdAt":"2023-03-22T21:58:13.701Z","updatedAt":"2023-03-23T20:34:52.038Z","id":"641b79f5851dab7d1134ca46"}
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
router.post("/", authorize, hasRole("seller"), ProductController.store);

/**
 * @openapi
 * /products/buy:
 *   post:
 *     summary: Purchase an item
 *     description: api to purchase a product
 *     tags: [PRODUCT]
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
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                  type: number
 *               quantity:
 *                  type: number
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"totalCost":40,"balance":[100,50,10],"product":{"_id":"641b79f5851dab7d1134ca46","sellerId":"641b72d131746a248b160976","amountAvailable":41,"cost":20,"productName":"Coke","createdAt":"2023-03-22T21:58:13.701Z","updatedAt":"2023-03-23T23:17:12.697Z","id":"641b79f5851dab7d1134ca46"}}
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
router.post("/buy", authorize, hasRole("buyer"), ProductController.buyItem);

/**
 * @openapi
 * /products/{id}:
 *   put:
 *     summary: Update product
 *     description: api to update product
 *     tags: [PRODUCT]
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
 *             required: [productName, amountAvailable, cost]
 *             properties:
 *               productName:
 *                  type: [string]
 *                  required: true
 *               amountAvailable:
 *                  type: [string]
 *                  required: true
 *               cost:
 *                  type: [number]
 *                  required: true
 *
 *
 *
 *     responses:
 *       200:
 *         description: success response
 *         content:
 *           application/json:
 *             example:
 *              data: {"_id":"641b79f5851dab7d1134ca46","sellerId":"641b72d131746a248b160976","amountAvailable":43,"cost":20,"productName":"Coke","createdAt":"2023-03-22T21:58:13.701Z","updatedAt":"2023-03-23T20:34:52.038Z","id":"641b79f5851dab7d1134ca46"}
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
router.put("/:id", authorize, hasRole("seller"), ProductController.update);

/**
 * @openapi
 * /products/{id}:
 *   delete:
 *     summary: Delete product
 *     description: api to delete a product
 *     tags: [PRODUCT]
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
router.delete(
  "/:id",
  authorize,
  hasRole("seller"),
  ProductController.deleteProduct
);

export default router;
