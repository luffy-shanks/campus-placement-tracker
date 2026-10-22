import { mockDrives } from '../src/data/mockData.js';

const apiBase = (process.env.CPT_API_BASE_URL || 'https://campus-placement-tracker-07s1.onrender.com/api/v1').replace(/\/$/, '');
const email = process.env.CPT_ADMIN_EMAIL?.trim();
const password = process.env.CPT_ADMIN_PASSWORD;
const sampleDrives = mockDrives.filter(drive => drive.id.startsWith('seed-'));

async function readJson(response) {
  const value = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(value.message || `API request failed (${response.status}).`);
  return value;
}

async function publish() {
  if (!email || !password) throw new Error('Set CPT_ADMIN_EMAIL and CPT_ADMIN_PASSWORD for a real admin account.');
  const login = await readJson(await fetch(`${apiBase}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }));
  if (login.user?.role !== 'admin') throw new Error('The supplied account is not an administrator.');

  const headers = { Authorization: `Bearer ${login.token}`, 'Content-Type': 'application/json' };
  const existing = await readJson(await fetch(`${apiBase}/drives`, { headers }));
  let created = 0;
  let skipped = 0;
  for (const { id: _id, ...drive } of sampleDrives) {
    if (existing.some(item => item.companyName === drive.companyName && item.role === drive.role)) {
      skipped++;
      continue;
    }
    await readJson(await fetch(`${apiBase}/drives`, {
      method: 'POST',
      headers,
      body: JSON.stringify(drive),
    }));
    created++;
  }
  const published = await readJson(await fetch(`${apiBase}/drives`, { headers }));
  const matching = published.filter(item => sampleDrives.some(drive => drive.companyName === item.companyName && drive.role === item.role));
  const withLinks = matching.filter(drive => drive.externalApplicationUrl).length;
  console.log(`Live API sample drives: ${matching.length}; with links: ${withLinks}; without links: ${matching.length - withLinks}; created this run: ${created}; skipped: ${skipped}.`);
}

publish().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
