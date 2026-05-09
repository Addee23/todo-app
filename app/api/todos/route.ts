import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";


export async function GET() {
  try {
    const todos = await prisma.todos.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return Response.json(todos);
  } catch (error) {
    console.error("Could not fetch todos:", error);
    return Response.json({ error: "Could not fetch todos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const text = body.text;

    if (!text || text.trim() === "") {
      return Response.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const newTodo = await prisma.todos.create({
      data: {
        text: text.trim(),
        completed: false,
      },
    });

    return Response.json({
      id: newTodo.id,
      text: newTodo.text,
      completed: newTodo.completed,
      created_at: newTodo.created_at.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error("Could not create todo:", error);
    return Response.json({ error: "Could not create todo" }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.role !== "admin") {
      return Response.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id = body.id;

    if (typeof id !== "number") {
      return Response.json(
        { error: "Valid id is required" },
        { status: 400 }
      );
    }

    await prisma.todos.delete({
      where: {
        id,
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Could not delete todo:", error);
    return Response.json({ error: "Could not delete todo" }, { status: 500 });
  }
}


export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    const id = body.id;
    const completed = body.completed;

    if (!id || typeof completed !== "boolean") {
      return Response.json(
        { error: "Id and completed are required" },
        { status: 400 }
      );
    }

    const updatedTodo = await prisma.todos.update({
      where: {
        id,
      },
      data: {
        completed,
      },
    });

    return Response.json({
      id: updatedTodo.id,
      text: updatedTodo.text,
      completed: updatedTodo.completed,
      created_at: updatedTodo.created_at.toISOString(),
    });
  } catch (error) {
    console.error("Could not update todo:", error);
    return Response.json({ error: "Could not update todo" }, { status: 500 });
  }
}


