import {Router} from 'express';
import {getAll} from '../controllers/stickers.js';

const router = Router();

router.get('/api/stickers', getAll);

export default router;