"use client";

import { type FormEvent, useEffect, useState } from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

type User = {
  id: number;
  username: string;
  role: "admin" | "staff";
};

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const response = await fetch("/api/todos");

        if (!response.ok) return;

        const data: Todo[] = await response.json();

        setTodos(data);
      } catch (error) {
        console.error("Could not fetch todos:", error);
      }
    }

    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/me");

        if (!response.ok) return;

        const data: { user: User } = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Could not fetch user:", error);
      }
    }

    fetchTodos();
    fetchUser();
  }, []);

  const completedTodos = todos.filter((todo) => todo.completed).length;
  const activeTodos = todos.length - completedTodos;

  async function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (text.trim() === "") return;

    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.trim(),
        }),
      });

      if (!response.ok) return;

      const newTodo: Todo = await response.json();

      setTodos([newTodo, ...todos]);
      setText("");
    } catch (error) {
      console.error("Could not add todo:", error);
    }
  }

  async function toggleTodo(id: number) {
    const todo = todos.find((todo) => todo.id === id);

    if (!todo) return;

    const updatedCompleted = !todo.completed;

    try {
      const response = await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          completed: updatedCompleted,
        }),
      });

      if (!response.ok) return;

      setTodos(
        todos.map((todo) =>
          todo.id === id
            ? { ...todo, completed: updatedCompleted }
            : todo
        )
      );
    } catch (error) {
      console.error("Could not update todo:", error);
    }
  }

  async function deleteTodo(id: number) {
    try {
      const response = await fetch("/api/todos", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) return;

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Could not delete todo:", error);
    }
  }

  async function logout() {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (!response.ok) return;

      window.location.href = "/login";
    } catch (error) {
      console.error("Could not logout:", error);
    }
  }

  return (
    <section className="w-full max-w-2xl rounded-3xl border border-white/15 bg-white/95 p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-8">
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Next.js + Tailwind
        </p>
        <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
          Min Todo App
        </h1>

        <p className="mt-3 max-w-xl text-slate-600">
          Skriv en uppgift, markera den som klar och ta bort den n&auml;r du
          &auml;r f&auml;rdig.
        </p>

        {user && (
          <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-slate-100 p-3">
            <p className="text-sm font-medium text-slate-600">
              Inloggad som {user.username} ({user.role})
            </p>

            <button
              onClick={logout}
              className="cursor-pointer rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-700"
            >
              Logga ut
            </button>
          </div>
        )}

      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-slate-100 p-4">
          <p className="text-2xl font-black text-slate-950">{todos.length}</p>
          <p className="text-sm text-slate-500">Totalt</p>
        </div>
        <div className="rounded-2xl bg-teal-50 p-4">
          <p className="text-2xl font-black text-teal-800">{activeTodos}</p>
          <p className="text-sm text-teal-700">Kvar</p>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-4">
          <p className="text-2xl font-black text-emerald-800">{completedTodos}</p>
          <p className="text-sm text-emerald-700">Klara</p>
        </div>
      </div>

      <form onSubmit={addTodo} className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Skriv en uppgift..."
          className="min-h-12 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-slate-950 outline-none transition focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-100"
        />

        <button
          type="submit"
          className="min-h-12 cursor-pointer rounded-2xl bg-teal-600 px-6 font-bold text-white shadow-lg shadow-teal-900/20 transition hover:-translate-y-0.5 hover:bg-teal-700"
        >
          L&auml;gg till
        </button>
      </form>

      <ul className="space-y-3">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm"
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border font-black transition ${
                todo.completed
                  ? "border-teal-600 bg-teal-600 text-white"
                  : "border-slate-300 bg-white text-transparent hover:border-teal-500"
              }`}
              aria-label="Markera uppgift"
            >
              &#10003;
            </button>

            <button
              onClick={() => toggleTodo(todo.id)}
              className={`min-w-0 flex-1 cursor-pointer text-left text-base font-medium ${
                todo.completed
                  ? "text-slate-400 line-through"
                  : "text-slate-800"
              }`}
            >
              {todo.text}
            </button>

            {user?.role === "admin" && (
              <button
                onClick={() => deleteTodo(todo.id)}
                className="cursor-pointer rounded-xl bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-100"
              >
                Ta bort
              </button>
            )}

          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-lg font-bold text-slate-800">Inga uppgifter &auml;nnu</p>
          <p className="mt-1 text-slate-500">
            L&auml;gg till din f&ouml;rsta uppgift i f&auml;ltet ovanf&ouml;r.
          </p>
        </div>
      )}
    </section>
  );
}
