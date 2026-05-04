import { db } from "@/lib/db";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

type TodoRow = RowDataPacket & {
  id: number;
  text: string;
  completed: 0 | 1;
  created_at: Date;
};

export async function GET() {
  const [rows] = await db.query<TodoRow[]>(
    "SELECT id, text, completed, created_at FROM todos ORDER BY id DESC"
  );

  const todos = rows.map((todo) => ({
    id: todo.id,
    text: todo.text,
    completed: Boolean(todo.completed),
    created_at: todo.created_at,
  }));

  return Response.json(todos);
}

export async function POST(request: Request) {
  const body = await request.json();

  const text = body.text;

  if (!text || text.trim() === "") {
    return Response.json(
      { error: "Text is required" },
      { status: 400 }
    );
  }

  const [result] = await db.query<ResultSetHeader>(
    "INSERT INTO todos (text, completed) VALUES (?, false)",
    [text.trim()]
  );

  const newTodo = {
    id: result.insertId,
    text: text.trim(),
    completed: false,
  };

  return Response.json(newTodo, { status: 201 });
}


export async function DELETE(request: Request) {
  const body = await request.json();

  const id = body.id;

  if (!id) {
    return Response.json(
      { error: "Id is required" },
      { status: 400 }
    );
  }

  await db.query("DELETE FROM todos WHERE id = ?", [id]);

  return Response.json({ success: true });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const id = body.id;
  const completed = body.completed;

  if (!id || typeof completed !== "boolean") {
    return Response.json(
      { error: "Id and completed are required" },
      { status: 400 }
    );
  }

  await db.query(
    "UPDATE todos SET completed = ? WHERE id = ?",
    [completed, id]
  );

  return Response.json({
    id,
    completed,
  });
}


