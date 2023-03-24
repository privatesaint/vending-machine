import { Router } from "express";
import product from "./product";
import user from "./users";
import auth from "./auth";

const router = Router();

router.use("/products", product);
router.use("/user", user);
router.use("/auth", auth);

export default router;
