// api/sheets.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { google } from 'googleapis';

const CACHE_TTL_MS = 60_000;
let cache: { data: unknown; ts: number } | null = null;

type Status = 'green' | 'yellow' | 'red';
type MeetingType = 'meeting' | 'stage-deadline' | 'handover';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    if (cache && Date.now() - cache.ts < CACHE_TTL_MS) {
      return res.status(200).json(cache.data);
    }

    const auth = new google.auth.GoogleAuth({
      apiKey: process.env.GOOGLE_API_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.SPREADSHEET_ID;
    if (!spreadsheetId) {
      return res.status(500).json({ error: 'SPREADSHEET_ID is not set' });
    }

    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: [
        'Projects!A2:E',
        'Tasks!A2:F',
        'Meetings!A2:G',
        'Leads!A2:H',
      ],
    });

    const [projectsRaw = [], tasksRaw = [], meetingsRaw = [], leadsRaw = []] =
      response.data.valueRanges?.map(v => v.values ?? []) ?? [];

    const projects = projectsRaw
      .filter(r => r[0] && r[1])
      .map(r => ({
        id: String(r[0]),
        name: String(r[1]),
        owner: String(r[2] ?? ''),
        status: (['green', 'yellow', 'red'].includes(r[3]) ? r[3] : 'yellow') as Status,
        date: String(r[4] ?? ''),
      }));

    const tasks = tasksRaw
      .filter(r => r[0] && r[1])
      .map(r => ({
        id: String(r[0]),
        title: String(r[1]),
        project: String(r[2] ?? ''),
        owner: String(r[3] ?? ''),
        dueDate: String(r[4] ?? ''),
        status: String(r[5] ?? '').toLowerCase(),
      }));

    const meetings = meetingsRaw
      .filter(r => r[0] && r[1])
      .map(r => ({
        id: String(r[0]),
        topic: String(r[1]),
        date: String(r[2] ?? ''),
        timeMsk: String(r[3] ?? ''),
        owner: String(r[4] ?? ''),
        type: (['meeting', 'stage-deadline', 'handover'].includes(r[5])
          ? r[5]
          : 'meeting') as MeetingType,
        vksUrl: String(r[6] ?? ''),
      }));

    const leads = leadsRaw
      .filter(r => r[0] && r[1])
      .map(r => ({
        id: String(r[0]),
        name: String(r[1]),
        source: String(r[2] ?? ''),
        stage: String(r[3] ?? ''),
        score: Number(r[4] ?? 0) || 0,
        nextStep: String(r[5] ?? ''),
        nextStepDate: String(r[6] ?? ''),
      }));

    const payload = {
      projects,
      tasks,
      meetings,
      leads,
      updatedAt: new Date().toISOString(),
    };

    cache = { data: payload, ts: Date.now() };
    return res.status(200).json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Sheets API error:', message);
    return res.status(500).json({ error: message });
  }
}