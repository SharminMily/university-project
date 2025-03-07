import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'
import { AuthController } from './auth.controller'

const router = express.Router()

router.post('/login',validateRequest(AuthValidation.loginValidationSchema), 
AuthController.loginUser
)

router.post('/change-password',validateRequest(AuthValidation.changePasswordValidationSchema),
AuthController.changePassword
)

router.post(
    '/refresh-token',
    validateRequest(AuthValidation.refreshTokenValidationSchema),
    AuthController.refreshToken,
  );
router.post(
    '/forget-password',
    validateRequest(AuthValidation.forgetPasswordValidationSchema),
    AuthController.forgetPassword,
  );
router.post(
    '/reset-password',
    validateRequest(AuthValidation.resetPasswordValidationSchema),
    AuthController.resetPassword,
  );

export const authRoutes = router