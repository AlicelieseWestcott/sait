interface Task {
  id: string;
  title: string;
  project: string;
  owner: string;
  dueDate: string;
  status: string;
}

interface Props {
  tasks: Task[];
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

function isOverdue(iso: string): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d.getTime() < today.getTime();
}

const MAX_TASKS = 10;

export function TasksBlock({ tasks }: Props) {
  if (!tasks || tasks.length === 0) {
    return <p className="text-slate-400 dark:text-slate-500 text-sm py-4">Нет задач</p>;
  }

  const visible = tasks.slice(0, MAX_TASKS);
  const rest = Math.max(0, tasks.length - MAX_TASKS);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
        {visible.map(task => {
          const overdue = task.status !== 'done' && isOverdue(task.dueDate);
          const titleClass =
            task.status === 'done'
              ? 'text-slate-400 line-through'
              : overdue
                ? 'text-red-600 dark:text-red-400'
                : 'text-slate-900 dark:text-white';

          return (
            <li key={task.id} className="py-2.5">
              <div className={`font-medium text-sm ${titleClass}`}>{task.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {task.project && <span>📁 {task.project}</span>}
                {task.owner && <span>👤 {task.owner}</span>}
                {task.dueDate && <span>📅 {formatDate(task.dueDate)}</span>}
                {overdue && <span className="text-red-600 dark:text-red-400 font-medium">⚠ просрочено</span>}
                {task.status === 'done' && <span className="text-green-600 dark:text-green-400">✓ выполнено</span>}
              </div>
            </li>
          );
        })}
      </ul>

      {rest > 0 && (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-700">
          ещё {rest}
        </div>
      )}
    </div>
  );
}