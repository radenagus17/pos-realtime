"use client";

import { createClient } from "@/lib/supabase/client";
import { profileAtom, userAtom } from "@/stores/auth-store";
import { Profile } from "@/types/auth";
import { useSetAtom } from "jotai";
import { useEffect } from "react";

export function AuthStoreProvider({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) {
  const setUser = useSetAtom(userAtom);
  const setProfile = useSetAtom(profileAtom);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setProfile(profile);
    });
  });

  return <>{children}</>;
}
