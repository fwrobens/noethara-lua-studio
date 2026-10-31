import type { SVGProps } from "react";

// Custom duotone icon set: `active` fills the secondary layer with a translucent tint.
type P = SVGProps<SVGSVGElement> & { active?: boolean; size?: number };

function Base({ active, size = 20, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-active={active ? "" : undefined}
      className="[&_.duo]:fill-transparent [&_.duo]:transition-[fill] [&_.duo]:duration-300 data-[active]:[&_.duo]:fill-current data-[active]:[&_.duo]:opacity-30"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const StudioIcon = (p: P) => (
  <Base {...p}>
    <rect className="duo" x="3" y="4" width="18" height="16" rx="3" stroke="none" />
    <rect x="3" y="4" width="18" height="16" rx="3" />
    <path d="M9 10l-2 2 2 2M15 10l2 2-2 2M12.8 9l-1.6 6" />
  </Base>
);
export const DiscoverIcon = (p: P) => (
  <Base {...p}>
    <circle className="duo" cx="12" cy="12" r="9" stroke="none" />
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </Base>
);
export const LibraryIcon = (p: P) => (
  <Base {...p}>
    <path className="duo" d="M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3v12c0 1.7-3.6 3-8 3s-8-1.3-8-3z" stroke="none" />
    <ellipse cx="12" cy="6" rx="8" ry="3" />
    <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
  </Base>
);
export const FileIcon = (p: P) => (
  <Base {...p}>
    <path className="duo" d="M6 3h8l4 4v14H6z" stroke="none" />
    <path d="M14 3H6v18h12V7z M14 3v4h4M9 13h6M9 17h4" />
  </Base>
);
export const FolderIcon = ({ open, ...p }: P & { open?: boolean }) => (
  <Base {...p}>
    <path className="duo" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="none" />
    {open ? (
      <path d="M3 17V7a2 2 0 012-2h4l2 2h7a2 2 0 012 2v1M3 17l2.5-6.5A1 1 0 016.4 10H21l-2.6 7.3a1 1 0 01-.9.7H4a1 1 0 01-1-1z" />
    ) : (
      <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    )}
  </Base>
);
export const PlayIcon = (p: P) => (
  <Base {...p}>
    <path d="M8 5.5v13a1 1 0 001.5.9l10-6.5a1 1 0 000-1.8l-10-6.5A1 1 0 008 5.5z" fill="currentColor" />
  </Base>
);
export const LogoMark = (p: P) => (
  <Base {...p} strokeWidth={1.4}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 2.5v6M12 12l5 5M12 12L7.5 9" />
    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
  </Base>
);
