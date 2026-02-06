import { z } from "zod";

export const TaskStatusEnum = z.enum(["todo", "in_progress", "done"]);

export const createTaskSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(3).max(100).optional(),
    description: z.string().max(500).optional(),
    status: TaskStatusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const taskIdSchema = z.object({
  id: z.string().uuid(),
});

export const listTasksSchema = z.object({
  status: TaskStatusEnum.optional(),
  q: z.string().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
