import { useEffect, useState } from 'react';

export type ProjectStatus = 'green' | 'yellow' | 'red';
export type MeetingType = 'meeting' | 'stage-deadline' | 'handover';

export interface Project {
  id: string;
  name: string;
  owner: string;
  status: ProjectStatus;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  project: string;
  owner: string;
  dueDate: string;
  status: string;
}

export interface Meeting {
  id: string;
  topic: string;
  date: string;
  timeMsk: string;
  owner: string;
  type: MeetingType;
  vksUrl: string;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  stage: string;
  score: number;
  nextStep: string;
  nextStepDate: string;
}

interface DashboardData {
  projects: Project[];
  tasks: Task[];
  meetings: Meeting[];
  leads: Lead[];
  updatedAt: string | null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    tasks: [],
    meetings: [],
    leads: [],
    updatedAt: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/sheets')
      .then(async r => {
        const text = await r.text();
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);
        try {
          return JSON.parse(text);
        } catch {
          throw new Error(`Non-JSON: ${text.slice(0, 120)}`);
        }
      })
      .then(json => {
        if (cancelled) return;
        setData({
          projects: json.projects ?? [],
          tasks: json.tasks ?? [],
          meetings: json.meetings ?? [],
          leads: json.leads ?? [],
          updatedAt: json.updatedAt ?? null,
        });
      })
      .catch(e => {
        if (!cancelled) setError(e.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...data, loading, error };
}