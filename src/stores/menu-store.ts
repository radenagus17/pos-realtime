import { MenuTypes } from "@/types/menu";
import { atom } from "jotai";

export const selectedMenuAtom = atom<
  (MenuTypes & { type: "update" | "delete" }) | null
>(null);
