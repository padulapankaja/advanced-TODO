import app from './app';
import dotenv from 'dotenv';
import './utils/scheduler';
dotenv.config();

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});