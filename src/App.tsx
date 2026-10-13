import { BlockCard } from './components/BlockCard';
import { ProjectsBlock } from './components/blocks/ProjectsBlock';
import { TasksBlock } from './components/blocks/TasksBlock';
import { CalendarBlock } from './components/blocks/CalendarBlock';
import { LeadsBlock } from './components/blocks/LeadsBlock';
import { useTheme } from './context/ThemeContext';
import { useDashboardData } from './hooks/useDashboardData';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { projects, tasks, meetings, leads, loading, error } = useDashboardData();

  const generatedAt = new Date().toLocaleDateString('ru-RU');

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4 md:p-6 transition-colors">
      <div className="flex items-center justify-between mb-4 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Дашборд</h1>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Переключить тему"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {loading && (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">Загрузка данных…</p>
      )}
      {error && (
        <p className="text-center text-red-500 py-8">Ошибка: {error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto">
          <BlockCard title="Главные проекты" count={projects.length} generatedAt={generatedAt}>
            <ProjectsBlock projects={projects} />
          </BlockCard>

          <BlockCard title="Задачи на неделю" count={tasks.length} generatedAt={generatedAt}>
            <TasksBlock tasks={tasks} />
          </BlockCard>

          <BlockCard title="Календарь" count={meetings.length} generatedAt={generatedAt}>
            <CalendarBlock meetings={meetings} />
          </BlockCard>

          <BlockCard title="Потенциальные проекты" count={leads.length} generatedAt={generatedAt}>
            <LeadsBlock leads={leads} />
          </BlockCard>
        </div>
      )}
    </main>
  );
}