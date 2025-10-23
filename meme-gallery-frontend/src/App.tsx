// src/App.tsx
import { MemeList } from "./components/MemeList";
import type { Meme } from "./types/meme";

const memes: Meme[] = [
  {
    id: 1,
    title: "Distracted Boyfriend",
    url: "https://i.imgur.com/Z6x7S8R.jpeg",
    userId: 1,
  },
  {
    id: 2,
    title: "Success Kid",
    url: "https://i.imgur.com/NP8B8Tt.jpeg",
    userId: 1,
  },
];

export default function App() {
  return (
    <main style={{ maxWidth: 760, margin: "2rem auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 24 }}>Meme Gallery (typed)</h1>

      <MemeList
        items={memes}
        renderItem={(meme: Meme) => (
          <article
            style={{
              padding: 12,
              border: "1px solid #e5e5e5",
              borderRadius: 8,
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            <h3 style={{ margin: "0 0 8px" }}>{meme.title}</h3>
            <img
              src={meme.url}
              alt={meme.title}
              width={280}
              style={{ display: "block", borderRadius: 6 }}
            />
          </article>
        )}
      />
    </main>
  );
}


