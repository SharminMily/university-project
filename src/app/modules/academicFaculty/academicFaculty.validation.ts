import { z } from 'zod';

const createAcademicFaculityValidationSchema = z.object({
  body : z.object({
    name: z.string({
      invalid_type_error: 'academicFaculity must be string',
    }),
  }),
});

const updateAcademicFaculityValidationSchema = z.object({
  body : z.object({
    name: z.string({
      invalid_type_error: 'academicFaculity must be string',
    }),
  }),
});

export const AcademicFaculityValidation = {
  createAcademicFaculityValidationSchema,
  updateAcademicFaculityValidationSchema
};
