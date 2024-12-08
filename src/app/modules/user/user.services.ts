/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import httpStatus from 'http-status';

import { Student } from '../student/student.interface';
import { StudentModel } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';

const createStudentIntoDB = async (password: string, payload: Student) => {
  //create a user object

  const userData: Partial<TUser> = {};

  // / if password is not given, use default password
  userData.password = password || (config.default_password as string);

   //set student role
   userData.role = 'student';

   // find academic semester info
   const admissionSemester = await AcademicSemester.findById(
     payload.admissionSemester,
   );
   
  if (!admissionSemester) {
    throw new AppError(404,'Admission semester is required');
  }

 const session = await mongoose.startSession () 

  try {
    session.startTransaction();
     //set  generated id(transection)
  userData.id = await generateStudentId(admissionSemester);

  // create a user (transaction-1)
  const newUser = await User.create([userData], { session }); // array

  //create a student
  if (!newUser.length) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
  }
    //set id, _ as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //ref

    const newStudent = await StudentModel.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const UserServices = {
  createStudentIntoDB,
};