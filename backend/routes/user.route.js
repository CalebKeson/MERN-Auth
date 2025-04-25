import express from 'express';
import { test, signup, signin } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', test);
router.post('/signup', signup)
router.post('/signin', signin)

export default router;
