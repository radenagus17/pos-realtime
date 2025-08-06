import { Profile } from "@/types/auth";
import { atom } from "jotai";

export const selectedUserAtom = atom<
  (Profile & { type: "update" | "delete" }) | null
>(null);
