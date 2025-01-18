import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validation';
import auth from '../../middlewares/auth';

const router = express.Router();
//will call controller
router.post(
  '/create-academic-semester',
  validateRequest(
    AcademicSemesterValidation.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/:courseId',
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:courseId',
  validateRequest(
    AcademicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

router.get('/',
  auth('admin'),
   AcademicSemesterControllers.getAllAcademicSemesters);

// console.log(AcademicSemesterControllers.getAllAcademicSemesters);

export const AcademicSemesterRoutes = router;
