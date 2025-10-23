import React from "react";
import type { Meme } from "../types/meme"; // <- NOTE: points to meme.ts

interface MemeListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

// Generic list that works with any T that at least has an `id`
export function MemeList<T extends Meme>({ items, renderItem }: MemeListProps<T>) {
  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>{renderItem(item)}</div>
      ))}
    </div>
  );
}
