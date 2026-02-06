import { prisma } from "../prisma.config";
export type TaskStatus = "todo" | "in_progress" | "done";

type UpdateTaskDto = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};



type CreateTaskDto = {
  title: string;
  description?: string;
};


type ListQuery = {
  status?: TaskStatus;
  q?: string;
  page: number;
  limit: number;
};

function notFoundError() {
  const err: any = new Error("Task not found");
  err.statusCode = 404;
  err.code = "NOT_FOUND";
  return err;
}

export class TaskService {
  async create(data: CreateTaskDto) {
    return prisma.task.create({ data });
  }

  async list(query: ListQuery) {
    const { page, limit } = query;
    const skip = (page - 1) * limit;
    const take = limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.q) where.title = { contains: query.q };

    const [items, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      prisma.task.count({ where }),
    ]);

    return { items, page, limit, total };
  }

  async getById(id: string) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) throw notFoundError();
    return task;
  }

  async update(id: string, data: UpdateTaskDto) {
    await this.getById(id);
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string) {
    await this.getById(id);
    await prisma.task.delete({ where: { id } });
  }
}

export const taskService = new TaskService();
