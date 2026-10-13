interface Lead {
  id: string;
  name: string;
  source: string;
  stage: string;
  score: number;
  nextStep: string;
  nextStepDate: string;
}

interface Props {
  leads: Lead[];
}

function formatDate(iso: string): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
}

const MAX_LEADS = 10;

export function LeadsBlock({ leads }: Props) {
  if (!leads || leads.length === 0) {
    return <p className="text-slate-400 dark:text-slate-500 text-sm py-4">Нет потенциальных проектов</p>;
  }

  const visible = leads.slice(0, MAX_LEADS);
  const rest = Math.max(0, leads.length - MAX_LEADS);

  return (
    <div className="flex flex-col gap-2">
      <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
        {visible.map(lead => {
          const hasNextStep = Boolean(lead.nextStep);
          return (
            <li key={lead.id} className="py-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="font-medium text-sm text-slate-900 dark:text-white min-w-0">
                  {lead.name}
                </div>
                <div className="shrink-0 text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded px-1.5 py-0.5">
                  ★ {lead.score}/5
                </div>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap gap-x-3 gap-y-0.5">
                {lead.source && <span>📥 {lead.source}</span>}
                {lead.stage && <span>⚙ {lead.stage}</span>}
              </div>

              {hasNextStep ? (
                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                  <span className="text-slate-500 dark:text-slate-400">Следующий шаг: </span>
                  {lead.nextStep}
                  {lead.nextStepDate && (
                    <span className="text-slate-500 dark:text-slate-400">
                      {' '}· до {formatDate(lead.nextStepDate)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="text-xs mt-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 rounded px-2 py-1">
                  ⚠ Следующий шаг не назначен
                </div>
              )}
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