import request from "supertest";
import { app } from "../src/app";
import { prisma } from "../src/prisma.config";

jest.setTimeout(20000);

beforeAll(async () => {
  await prisma.task.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Tasks API", () => {
  it("POST /tasks creates task with default status", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "My task", description: "desc" })
      .expect(201);

    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("My task");
    expect(res.body.status).toBe("todo");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
  });

  it("GET /tasks supports filters + pagination", async () => {
    await prisma.task.createMany({
      data: [
        { title: "Buy milk", status: "todo" },
        { title: "Buy bread", status: "in_progress" },
        { title: "Read book", status: "done" },
      ],
    });

    const res = await request(app)
      .get("/tasks")
      .query({ q: "buy", page: 1, limit: 2 })
      .expect(200);

    expect(res.body).toHaveProperty("items");
    expect(res.body).toHaveProperty("total");
    expect(res.body.page).toBe(1);
    expect(res.body.limit).toBe(2);
    expect(res.body.items.length).toBeLessThanOrEqual(2);
  });

  it("GET /tasks/:id returns 404 for unknown id", async () => {
    await request(app)
      .get("/tasks/00000000-0000-0000-0000-000000000000")
      .expect(404);
  });

  it("PATCH /tasks/:id updates status", async () => {
    const task = await prisma.task.create({ data: { title: "Update me" } });

    const res = await request(app)
      .patch(`/tasks/${task.id}`)
      .send({ status: "done" })
      .expect(200);

    expect(res.body.status).toBe("done");
  });

  it("DELETE /tasks/:id returns 204", async () => {
    const task = await prisma.task.create({ data: { title: "Delete me" } });

    await request(app).delete(`/tasks/${task.id}`).expect(204);
  });
});
