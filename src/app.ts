import express from 'express';
import { errorHandler } from './middleware/errorHandler';
import apiRoutes from './routes/api';
import redirectRoutes from './routes/redirect';

const app = express();
import path from 'path';

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/api/urls', apiRoutes);
app.use('/', redirectRoutes);

// Global 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

export default app;
