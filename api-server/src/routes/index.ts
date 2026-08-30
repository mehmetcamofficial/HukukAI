import { Router, type IRouter } from "express";
import healthRouter from "./health";
import hukukaiRouter from "./hukukai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(hukukaiRouter);

export default router;
