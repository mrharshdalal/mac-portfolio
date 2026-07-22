import { create } from "zustand";
import { persist } from "zustand/middleware";
import { trashItems as initialTrash } from "@/data/portfolio";
import type { TrashItem } from "@/types";

interface TrashStore {
  items: TrashItem[];
  addItem: (item: TrashItem) => void;
  restoreItem: (id: string) => void;
  empty: () => void;
}

export const useTrashStore = create<TrashStore>()(
  persist(
    (set) => ({
      items: initialTrash,
      addItem: (item) => set((s) => ({ items: [...s.items, item] })),
      restoreItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      empty: () => set({ items: [] }),
    }),
    { name: "mac-portfolio-trash" },
  ),
);
