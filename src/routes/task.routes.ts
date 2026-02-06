import { Router } from "express";
import { taskController } from "../controllers/task.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/", asyncHandler(taskController.create));
router.get("/", asyncHandler(taskController.list));
router.get("/:id", asyncHandler(taskController.getById));
router.patch("/:id", asyncHandler(taskController.update));
router.delete("/:id", asyncHandler(taskController.delete));

export default router;
