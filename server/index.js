import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import app from './app.js';
import { User } from './models.js';

const port = Number(process.env.PORT || 3001);

async function start() {
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required. Copy .env.example to .env and configure MongoDB.');
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET must be set to a random value of at least 32 characters.');

  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB.');

  const bootstrapEmail = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const bootstrapPassword = process.env.BOOTSTRAP_ADMIN_PASSWORD;
  if (bootstrapEmail && bootstrapPassword) {
    const adminExists = await User.exists({ role: 'admin' });
    if (!adminExists && !(await User.exists({ email: bootstrapEmail }))) {
      await User.create({ name: process.env.BOOTSTRAP_ADMIN_NAME || 'Placement Administrator', email: bootstrapEmail, passwordHash: await bcrypt.hash(bootstrapPassword, 12), role: 'admin' });
      console.log(`Created first administrator account for ${bootstrapEmail}.`);
    }
  }

  const server = app.listen(port, () => console.log(`Campus Placement API listening on http://localhost:${port}/api/v1`));
  const shutdown = async signal => {
    console.log(`${signal} received; shutting down.`);
    server.close(async () => { await mongoose.disconnect(); process.exit(0); });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch(error => { console.error(error.message); process.exit(1); });
