import type { ReactNode } from "react";
import { Sidebar } from "../lib/shared";

export default function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="orbit" style={{ display: "flex", minHeight: "100vh", background: "var(--ink)", color: "var(--fg)" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
    </div>
  );
}
