import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// __dirname trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const subscriptionServiceUrl =
  process.env.SUBSCRIPTION_SERVICE_URL || 'http://localhost:5001';
export const lmsServiceUrl =
  process.env.LMS_SERVICE_URL || 'http://localhost:5002';
export const communityServiceUrl =
  process.env.COMMUNITY_SERVICE_URL || 'http://localhost:5003';