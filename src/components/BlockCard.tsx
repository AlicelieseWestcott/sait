interface BlockCardProps {
  title: string;
  count: number;
  generatedAt: string;
  children?: React.ReactNode;
}

export function BlockCard({ title, count, generatedAt, children }: BlockCardProps) {
  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 flex flex-col min-h-[300px] transition-colors">
      <header className="flex justify-between items-baseline mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {count} · на {generatedAt}
        </span>
      </header>
      <div className="flex-1">{children}</div>
    </section>
  );
}