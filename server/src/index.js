import app from './app.js';
import {connectDB} from '../src/databases/db.js';

import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ DB connect error:', err);
    process.exit(1);
  });
