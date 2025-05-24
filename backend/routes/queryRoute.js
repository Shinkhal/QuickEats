import express from 'express';
import { submitQuery, getQueries } from '../controllers/queryController.js';

const router = express.Router();

router.post('/submit-query', submitQuery);
router.get('/queries', getQueries);

export default router;
