import 'dotenv/config';
import mongoose from 'mongoose';
import { Issue } from '../models/Issue.js';

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/issue_tracker';

await mongoose.connect(uri);
await Issue.init();
await mongoose.connection.close();

console.log('MongoDB is connected and the issues indexes are ready.');
