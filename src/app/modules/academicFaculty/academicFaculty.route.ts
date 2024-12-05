import express from 'express';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { AcademicFaculityValidation } from './academicFaculty.validation';


const router = express.Router();
//will call controller


router.post(
  '/create-academic-faculty',
  validateRequest(
   AcademicFaculityValidation.createAcademicFaculityValidationSchema,
  ),
 AcademicFacultyControllers.createAcademicFaculty,
);

router.get(
  '/:facultyId',
  AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFaculityValidation.updateAcademicFaculityValidationSchema,
  ),
  AcademicFacultyControllers.updateAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFacultys);

export const AcademicFacultyRoutes = router;
