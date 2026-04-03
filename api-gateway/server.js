import dotenv from 'dotenv';
dotenv.config();

import app from './src/app.js';
const PORT = process.env.API_GATEWAY_PORT || 3000;

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});

