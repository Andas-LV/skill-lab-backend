import { Router } from 'express';
import { coursesListController, courseByIdController } from '@/controllers/course';

const router = Router();

router.get('/list', coursesListController);
router.get('/:id', courseByIdController);

export const courseRouter = router;