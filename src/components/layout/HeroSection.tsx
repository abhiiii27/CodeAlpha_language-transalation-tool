import { Sparkles, Languages, History, FileDown } from "lucide-react";

export default function HeroSection() {
  const highlights = [
    {
      icon: <Languages className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      label: "12+ Languages",
    },
    {
      icon: <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      label: "AI Neural Engine",
    },
    {
      icon: <History className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      label: "Smart Phrasebook Folders",
    },
    {
      icon: <FileDown className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
      label: "Document Loader",
    },
  ];

  return (
    <section className="w-full py-8 md:py-12 animate-fade-in flex flex-col items-center">
      <div className="w-full max-w-5xl mx-auto text-center flex flex-col items-center">
        <h1 className="font-sans font-bold text-3xl sm:text-4xl md:text-5xl text-slate-800 dark:text-white tracking-tight leading-tight mb-4 max-w-4xl select-none">
          Contextual Language Translation with <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">Neural Precision</span>.
        </h1>

        <p className="font-sans text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6">
          Leverage high-context neural language models to achieve fluent and precise translations. Keep expressions organized across customizable phrasebook folders.
        </p>

        {/* Highlight Badges */}
        <div className="flex flex-wrap justify-center gap-2.5">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs font-semibold text-slate-700 dark:text-slate-350"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
