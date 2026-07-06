export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
        <p>
          NCMT<span className="text-accent-bright">.</span> Family-owned transport.
        </p>
        <p>© {new Date().getFullYear()} NCMT Transport. All rights reserved.</p>
      </div>
    </footer>
  );
}
