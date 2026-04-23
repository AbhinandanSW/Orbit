import type { CSSProperties, ReactNode } from "react";

type IP = { size?: number; stroke?: number; style?: CSSProperties };

const IconBase = ({ children, size = 18, stroke = 1.6, style }: IP & { children: ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {children}
  </svg>
);

export const Icon = {
  Home: (p: IP) => <IconBase {...p}><path d="M3 8l7-5 7 5v8a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V8z"/></IconBase>,
  Chart: (p: IP) => <IconBase {...p}><path d="M3 17V7M9 17V3M15 17v-7"/><path d="M2 17h16"/></IconBase>,
  Pen: (p: IP) => <IconBase {...p}><path d="M3 17l1-4L14 3l3 3L7 16l-4 1z"/></IconBase>,
  Library: (p: IP) => <IconBase {...p}><rect x="3" y="3" width="6" height="14" rx="1"/><rect x="11" y="3" width="6" height="8" rx="1"/><rect x="11" y="13" width="6" height="4" rx="1"/></IconBase>,
  Calendar: (p: IP) => <IconBase {...p}><rect x="3" y="4" width="14" height="13" rx="2"/><path d="M3 8h14M7 2v4M13 2v4"/></IconBase>,
  Inbox: (p: IP) => <IconBase {...p}><path d="M3 10l3-6h8l3 6v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5z"/><path d="M3 10h4l1 2h4l1-2h4"/></IconBase>,
  Sparkle: (p: IP) => <IconBase {...p}><path d="M10 2l1.5 5L17 8.5 11.5 10 10 15l-1.5-5L3 8.5 8.5 7 10 2z"/></IconBase>,
  Plus: (p: IP) => <IconBase {...p}><path d="M10 3v14M3 10h14"/></IconBase>,
  Search: (p: IP) => <IconBase {...p}><circle cx="9" cy="9" r="5"/><path d="M13 13l4 4"/></IconBase>,
  Bell: (p: IP) => <IconBase {...p}><path d="M5 15V9a5 5 0 0110 0v6M3 15h14M8 17a2 2 0 004 0"/></IconBase>,
  Settings: (p: IP) => <IconBase {...p}><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4"/></IconBase>,
  Arrow: (p: IP) => <IconBase {...p}><path d="M4 10h12M11 5l5 5-5 5"/></IconBase>,
  ArrowUpRight: (p: IP) => <IconBase {...p}><path d="M6 14L14 6M7 6h7v7"/></IconBase>,
  ArrowDown: (p: IP) => <IconBase {...p}><path d="M10 4v12M5 11l5 5 5-5"/></IconBase>,
  Check: (p: IP) => <IconBase {...p}><path d="M4 10l4 4 8-8"/></IconBase>,
  Image: (p: IP) => <IconBase {...p}><rect x="3" y="3" width="14" height="14" rx="2"/><circle cx="7.5" cy="7.5" r="1.5"/><path d="M3 14l4-4 4 4 2-2 4 4"/></IconBase>,
  Video: (p: IP) => <IconBase {...p}><rect x="2" y="5" width="12" height="10" rx="2"/><path d="M14 9l4-2v6l-4-2z"/></IconBase>,
  Hash: (p: IP) => <IconBase {...p}><path d="M7 3l-2 14M15 3l-2 14M3 7h14M2 13h14"/></IconBase>,
  Users: (p: IP) => <IconBase {...p}><circle cx="7" cy="7" r="3"/><path d="M2 17c0-3 2-5 5-5s5 2 5 5"/><circle cx="14" cy="8" r="2.5"/><path d="M13 12c2.5 0 5 1.5 5 4"/></IconBase>,
  Clock: (p: IP) => <IconBase {...p}><circle cx="10" cy="10" r="7"/><path d="M10 5v5l3 2"/></IconBase>,
  Globe: (p: IP) => <IconBase {...p}><circle cx="10" cy="10" r="7"/><path d="M3 10h14M10 3c2 2 3 5 3 7s-1 5-3 7c-2-2-3-5-3-7s1-5 3-7z"/></IconBase>,
  Filter: (p: IP) => <IconBase {...p}><path d="M3 4h14l-5 7v5l-4-2v-3L3 4z"/></IconBase>,
  Send: (p: IP) => <IconBase {...p}><path d="M17 3L9 11M17 3l-5 14-3-6-6-3 14-5z"/></IconBase>,
  Dots: (p: IP) => <IconBase {...p}><circle cx="5" cy="10" r="1.2" fill="currentColor"/><circle cx="10" cy="10" r="1.2" fill="currentColor"/><circle cx="15" cy="10" r="1.2" fill="currentColor"/></IconBase>,
  X: (p: IP) => <IconBase {...p}><path d="M4 4l12 12M16 4L4 16"/></IconBase>,
  Heart: (p: IP) => <IconBase {...p}><path d="M10 17s-6-4-6-9a3 3 0 016-1 3 3 0 016 1c0 5-6 9-6 9z"/></IconBase>,
  Play: (p: IP) => <IconBase {...p}><path d="M6 4l10 6-10 6V4z"/></IconBase>,
  Upload: (p: IP) => <IconBase {...p}><path d="M10 14V3M5 8l5-5 5 5M3 17h14"/></IconBase>,
  Link: (p: IP) => <IconBase {...p}><path d="M8 12l4-4M7 13a3 3 0 01-4-4l2-2a3 3 0 014 0M13 7a3 3 0 014 4l-2 2a3 3 0 01-4 0"/></IconBase>,
  Crown: (p: IP) => <IconBase {...p}><path d="M3 7l3 4 4-6 4 6 3-4v9H3V7z"/></IconBase>,
  Eye: (p: IP) => <IconBase {...p}><path d="M1 10s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6z"/><circle cx="10" cy="10" r="2.5"/></IconBase>,
  Chevron: (p: IP) => <IconBase {...p}><path d="M7 5l5 5-5 5"/></IconBase>,
  ChevronDown: (p: IP) => <IconBase {...p}><path d="M5 8l5 5 5-5"/></IconBase>,
  Menu: (p: IP) => <IconBase {...p}><path d="M3 6h14M3 10h14M3 14h14"/></IconBase>,
  Trash: (p: IP) => <IconBase {...p}><path d="M4 6h12M7 6V4h6v2M5 6l1 11h8l1-11"/></IconBase>,
  Folder: (p: IP) => <IconBase {...p}><path d="M2 6a2 2 0 012-2h4l2 2h6a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/></IconBase>,
  Pin: (p: IP) => <IconBase {...p}><path d="M12 2l6 6-4 1-1 4-2-2-4 4v-4L5 9l4-1 1-4 2 2z"/></IconBase>,
  Star: (p: IP) => <IconBase {...p}><path d="M10 2l2.5 5L18 7.5l-4 4L15 17l-5-3-5 3 1-5.5-4-4L7.5 7 10 2z"/></IconBase>,
};

export const Platform = {
  instagram: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.8-.4 2.2a3.7 3.7 0 0 1-.9 1.4 3.7 3.7 0 0 1-1.4.9c-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.3-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c0-1.2.3-1.8.4-2.2a3.7 3.7 0 0 1 .9-1.4 3.7 3.7 0 0 1 1.4-.9c.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2m0 2.1c-3.1 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.5-1.3.8-.3.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1C2.6 10.2 2.6 10.6 2.6 13s0 2.8.1 4c0 1.1.2 1.7.4 2.1.2.5.5.9.8 1.3.4.3.8.6 1.3.8.4.2 1 .3 2.1.4 1.2 0 1.6 0 4.7 0s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.8.3-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1 0-1.2.1-1.6.1-4s0-2.8-.1-4c0-1.1-.2-1.7-.4-2.1a3.5 3.5 0 0 0-.8-1.3 3.5 3.5 0 0 0-1.3-.8c-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 3.4a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6zm0 7.9a3.1 3.1 0 1 0 0-6.3 3.1 3.1 0 0 0 0 6.3zm6.1-8.1a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z"/></svg>
  ),
  facebook: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H8v-2.9h2.4V9.8c0-2.4 1.4-3.7 3.6-3.7 1 0 2.1.2 2.1.2v2.3h-1.2c-1.2 0-1.5.7-1.5 1.5v1.8h2.6l-.4 2.9h-2.2v7A10 10 0 0 0 22 12z"/></svg>
  ),
  youtube: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M23 7.1a3 3 0 0 0-2.1-2.1C19 4.5 12 4.5 12 4.5s-7 0-8.9.5A3 3 0 0 0 1 7.1 31 31 0 0 0 .5 12 31 31 0 0 0 1 17a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5A3 3 0 0 0 23 17a31 31 0 0 0 .5-5 31 31 0 0 0-.5-4.9zM9.8 15.5V8.5l5.8 3.5-5.8 3.5z"/></svg>
  ),
  linkedin: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 3H3.6A.6.6 0 0 0 3 3.6v16.8c0 .3.3.6.6.6h16.8c.3 0 .6-.3.6-.6V3.6a.6.6 0 0 0-.6-.6zM8.3 18.3h-3V9.5h3v8.8zM6.8 8.2a1.7 1.7 0 1 1 0-3.5 1.7 1.7 0 0 1 0 3.5zm11.5 10.1h-3v-4.3c0-1 0-2.3-1.4-2.3s-1.6 1.1-1.6 2.2v4.4h-3V9.5h2.9v1.2c.4-.8 1.4-1.4 2.8-1.4 3 0 3.5 2 3.5 4.5v4.5z"/></svg>
  ),
  threads: ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M16.2 11.3c-.1 0-.2-.1-.3-.1-.1-2.5-1.5-3.9-3.8-4-1.4 0-2.6.6-3.3 1.7l1.3.9c.5-.8 1.3-1 2-1 .9 0 1.6.3 2 .8.3.4.5.9.6 1.6-.7-.1-1.5-.2-2.3-.1-2.3.1-3.8 1.5-3.7 3.3 0 .9.5 1.7 1.3 2.2.7.4 1.5.7 2.4.6 1.2-.1 2.1-.5 2.8-1.3.5-.6.8-1.3 1-2.3.6.3 1 .8 1.3 1.4.3.9.3 2.4-.9 3.6-1.1 1.1-2.4 1.5-4.4 1.5-2.2 0-3.9-.7-5-2.1-1-1.3-1.5-3.1-1.5-5.4s.5-4.2 1.5-5.5c1.1-1.4 2.8-2.1 5-2.1 2.2 0 3.9.7 5.1 2.1.6.7 1 1.6 1.3 2.6l1.7-.5c-.3-1.2-.9-2.3-1.6-3.2-1.5-1.8-3.7-2.7-6.5-2.7-2.7 0-4.9.9-6.4 2.7-1.4 1.7-2.1 4-2.1 6.7s.7 5 2.1 6.6c1.5 1.8 3.7 2.7 6.5 2.7 2.5 0 4.2-.6 5.6-2 1.8-1.8 1.8-4.1 1.2-5.5-.4-1.1-1.2-1.9-2.2-2.5zm-3.2 3.6c-.9.1-1.9-.3-1.9-1.3 0-.6.5-1.3 2-1.4h.6c.6 0 1.1 0 1.5.1-.2 1.9-1.1 2.5-2.2 2.6z"/></svg>
  ),
};

export const PlatformBg: Record<string, string> = {
  instagram: "linear-gradient(135deg, #F58529, #DD2A7B 50%, #8134AF)",
  facebook: "#1877F2",
  youtube: "#FF0000",
  linkedin: "#0A66C2",
  threads: "#000000",
};
