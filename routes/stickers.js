import {Router} from 'express';
import {create, getAll} from '../controllers/stickers.js';

const router = Router();

router.get('/api/stickers', getAll);

router.post('/api/stickers', create);

export default router;