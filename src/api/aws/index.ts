import express from 'express';
import submit from './submit';

// create auth router
const router = express.Router();
router.post('/submit', submit);

export default router;
