import express from 'express';
import { StudentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { updateStudentValidationSchema } from './student.validation';

const router = express.Router();
//will call controller

// router.post('/create-student', StudentControllers.createStudent);

router.get('/', StudentControllers.getAllStudent);

router.get('/:studentId', StudentControllers.getSingleStudent);

router.patch('/:studentId',
    validateRequest(updateStudentValidationSchema),
    StudentControllers.updatedStudent
);

router.delete('/:studentId', StudentControllers.deleteStudent);

export const StudentRoute = router;
