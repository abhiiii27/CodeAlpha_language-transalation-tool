export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="h-[48px] sm:h-9 bg-slate-900 text-slate-500 text-[10px] uppercase tracking-widest px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-1.5 shrink-0 mt-12 py-2 sm:py-0 select-none font-mono">
      <div>Connected: abhiiii27 Cluster-Node 01</div>
      <div className="flex gap-4 items-center">
        <span>Lat: 12ms</span>
        <span className="hidden sm:inline">Secure SSL</span>
        <span>© {currentYear} LingoAI Technologies</span>
      </div>
    </footer>
  );
}
