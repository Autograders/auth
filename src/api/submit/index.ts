import express from 'express';
import create from './create';

// create submit router
const router = express.Router();
router.post('/create', create);

export default router;
