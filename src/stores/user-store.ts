import { Profile } from "@/types/auth";
import { atom } from "jotai";

export const dialogFormUserAtom = atom<boolean>(false);

export const selectedUserAtom = atom<Profile | null>(null);
