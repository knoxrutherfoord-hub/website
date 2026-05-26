import { profile } from "@/lib/data";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-[13px] text-[var(--color-muted)] sm:px-8">
        <span>{profile.name}</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
