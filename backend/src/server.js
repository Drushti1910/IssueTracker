import 'dotenv/config';
import { app } from './app.js';
import { connectDatabase } from './config/database.js';
import './models/Issue.js';

const port = Number(process.env.PORT || 5000);

async function start() {
  await connectDatabase();
  app.listen(port, () => console.log(`Issue Tracker API listening on http://localhost:${port}`));
}

start().catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exit(1);
});
