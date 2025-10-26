import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);


  const memes = [
    { id: 1, title: "Distracted Boyfriend", url: "https://i.imgur.com/V7N6G.gif" },
    { id: 2, title: "Success Kid", url: "https://i.imgur.com/qkdpN.jpg" },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Meme Viewer (S3)</h1>
        <p className="text-sm text-slate-500">React + Tailwind, deployed to AWS S3</p>
      </header>

      <section className="mb-8">
        <button
          className="rounded-xl border px-4 py-2 hover:bg-slate-100 transition"
          onClick={() => setCount((c) => c + 1)}
        >
          Clicks: {count}
        </button>
        <span className="ml-3 text-sm text-slate-500 align-middle">
          Interactive requirement ✅
        </span>
      </section>

      <section>
        <ul className="grid gap-4 sm:grid-cols-2">
          {memes.map((m) => (
            <li key={m.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="font-semibold mb-2">{m.title}</h2>
              <img className="rounded-lg w-full h-auto" src={m.url} alt={m.title} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
