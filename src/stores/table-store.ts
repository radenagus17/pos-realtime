import { TableTypes } from "@/types/table";
import { atom } from "jotai";

export const selectedTableAtom = atom<
  (TableTypes & { type: "update" | "delete" }) | null
>(null);
