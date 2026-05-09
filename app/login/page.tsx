"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (username.trim() === "" || password.trim() === "") {
      setError("Fyll i användarnamn och lösenord.");
      return;
    }

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      if (!response.ok) {
        setError("Fel användarnamn eller lösenord.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Något gick fel. Försök igen.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-3xl bg-white p-6 text-slate-950 shadow-2xl"
      >
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">
          Todo App
        </p>

        <h1 className="mb-6 text-3xl font-black">
          Logga in
        </h1>

        <label className="mb-2 block text-sm font-bold">
          Användarnamn
        </label>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mb-4 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />

        <label className="mb-2 block text-sm font-bold">
          Lösenord
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-4 min-h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
        />

        {error && (
          <p className="mb-4 rounded-2xl bg-red-50 p-3 text-sm font-medium text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="min-h-12 w-full cursor-pointer rounded-2xl bg-teal-600 px-6 font-bold text-white transition hover:bg-teal-700"
        >
          Logga in
        </button>
      </form>
    </main>
  );
}
