import express from 'express';
import morgan from 'morgan';

// Add request size limits to prevent abuse and DoS attacks
const requestMiddleware = [
  morgan('dev'),
  express.json({ limit: '1mb' }),
];

export default requestMiddleware;