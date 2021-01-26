import express from 'express';
import signup from './signup';
import signin from './signin';
import verify from './verify';
import refresh from './refresh';
import signout from './signout';

// create auth router
const router = express.Router();
router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh', refresh);
router.post('/signout', signout);
router.get('/verify/:token', verify);

export default router;
