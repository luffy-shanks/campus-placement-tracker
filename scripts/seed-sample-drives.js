import 'dotenv/config';
import mongoose from 'mongoose';
import { mockDrives } from '../src/data/mockData.js';
import { Drive } from '../server/models.js';

const sampleDrives = mockDrives.filter(drive => drive.id.startsWith('seed-'));

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Configure it in your local .env file.');
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });

  let inserted = 0;
  let skipped = 0;
  for (const { id: _id, ...drive } of sampleDrives) {
    const exists = await Drive.exists({ companyName: drive.companyName, role: drive.role });
    if (exists) {
      skipped++;
      continue;
    }
    await Drive.create(drive);
    inserted++;
  }

  console.log(`Sample drives added: ${inserted}; already present and skipped: ${skipped}.`);
  await mongoose.disconnect();
}

seed().catch(async error => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exitCode = 1;
});
