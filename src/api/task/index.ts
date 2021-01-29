import express from 'express';
import create from './create';
import read from './read';
import update from './update';
import remove from './delete';

// create task router
const router = express.Router();
router.post('/create', create);
router.get('/', read);
router.get('/:taskId', read);
router.post('/update', update);
router.post('/delete', remove);

export default router;
