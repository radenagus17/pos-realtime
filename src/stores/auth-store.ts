import { INITIAL_PROFILE } from "@/constants/auth-constant";
import { Profile } from "@/types/auth";
import { User } from "@supabase/supabase-js";
import { atom } from "jotai";

export const userAtom = atom<User | null>(null);

export const profileAtom = atom<Profile>(INITIAL_PROFILE);
