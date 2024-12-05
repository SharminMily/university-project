import Joi from 'joi';

//creating a schema validation using joi
const userNameValidationSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, 'Capitalize format validation') // Ensure first letter is capitalized
    .messages({
      'string.empty': 'First Name is required',
      'string.max': 'Max allowed length is 20',
      'string.pattern.base': '{#value} is not in capitalize format',
    }),
  middleName: Joi.string().optional(),
  lastName: Joi.string()
    .required()
    .regex(/^[a-zA-Z]+$/, 'Alpha validation') // Ensure it's alphabetic
    .messages({
      'string.empty': 'Last Name is required',
      'string.pattern.base': '{#value} is not valid',
    }),
});

// Guardian validation schema
const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().optional(),
  fatherOccupation: Joi.string().optional(),
  fatherContactNo: Joi.string().optional(),
  motherName: Joi.string().optional(),
  motherOccupation: Joi.string().optional(),
  motherContactNo: Joi.string().optional(),
});

// LocalGuardian validation schema
const localguardianValidationSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
  }),
  occupation: Joi.string().required().messages({
    'string.empty': 'Occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact number is required',
  }),
  adress: Joi.string().required().messages({
    'string.empty': 'Address is required',
  }),
});

// Main Student validation schema
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'ID is required',
  }),
  name: userNameValidationSchema.required().messages({
    'any.required': 'Name is required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{#value} is not valid',
    'string.empty': 'Gender is required',
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required().messages({
    'string.email': '{#value} is not a valid email type',
    'string.empty': 'Email is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'string.empty': 'Emergency contact number is required',
  }),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional()
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent address is required',
  }),
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'Guardian is required',
  }),
  localGuardian: localguardianValidationSchema.required().messages({
    'any.required': 'Local guardian is required',
  }),
  profileImg: Joi.string().optional(),
  isActive: Joi.string().valid('active', 'block').default('active').messages({
    'any.only': '{#value} is not valid. Valid options are: active, block',
  }),
});

// export default studentValidationSchema;
