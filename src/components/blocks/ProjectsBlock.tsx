import type { Project as FullProject, Status } from '../../types';
import { stageStatus, projectStatus } from '../../domain/status';

const COLORS: Record<Status, string> = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

const MAX_PROJECTS = 10;

export interface SimpleProject {
  id: string;
  name: string;
  owner: string;
  status: 'green' | 'yellow' | 'red';
  date?: string;
}

type AnyProject = FullProject | SimpleProject;

function hasStages(p: AnyProject): p is FullProject {
  return Array.isArray((p as FullProject).stages);
}

interface Props {
  projects: AnyProject[];
}

export function ProjectsBlock({ projects }: Props) {
  if (!projects || projects.length === 0) {
    return <p className="text-slate-400 dark:text-slate-500 text-sm py-4">Нет проектов</p>;
  }

  const visible = projects.slice(0, MAX_PROJECTS);
  const inTime = visible.filter(p => {
    const st = hasStages(p) ? projectStatus(p) : p.status;
    return st === 'green';
  }).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 text-sm text-slate-700 dark:text-slate-200">
        В графике <b>{inTime}</b> из <b>{visible.length}</b>
      </div>

      <ul className="flex flex-col divide-y divide-slate-100 dark:divide-slate-700">
        {visible.map(p => {
          const status: Status = hasStages(p) ? projectStatus(p) : p.status;
          return (
            <li key={p.id} className="py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-slate-900 dark:text-white truncate">
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {p.owner || '— без ответственного'}
                    {'date' in p && p.date ? ` · ${p.date}` : ''}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full shrink-0 ${COLORS[status]}`} />
              </div>

              {hasStages(p) && p.stages.length > 0 && (
                <div className="flex gap-1.5 mt-2">
                  {p.stages.map((s, i) => (
                    <div
                      key={i}
                      title={`${s.name}: ${s.deadline}`}
                      className={`h-1.5 flex-1 rounded ${COLORS[stageStatus(s, p.owner)]}`}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {projects.length > MAX_PROJECTS && (
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-100 dark:border-slate-700">
          ещё {projects.length - MAX_PROJECTS}
        </div>
      )}
    </div>
  );
}