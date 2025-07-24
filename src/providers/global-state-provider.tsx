"use client";

import * as React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Provider } from "jotai";

export function GlobalStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <Provider>{children}</Provider>
    </NuqsAdapter>
  );
}
