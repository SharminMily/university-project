/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status'
import { Student } from './student.interface';

const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find()
  .populate('admissionSemester')
  .populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty'
    }
  });
  return result;
};

const getSingleStudentsFromDB = async (id: string) => {
  const result = await StudentModel.findOne( {id} )
 
  return result;
};

const getUpdateStudentsFromDB = async (id: string, payload: Partial<Student>) => {

  const {name, guardian, localGuardian, ...remainingStudentData} = payload;

  const modifiedUpdateData : Record<string, unknown> = {
    ...remainingStudentData,
  }

  if(name && Object.keys(name).length){
    for(const [key, value] of Object.entries(name)){
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  if(guardian && Object.keys(guardian).length){
    for(const [key, value] of Object.entries(guardian)){
      modifiedUpdateData[`guardian.${key}`] = value;
    }
  }

  if(localGuardian && Object.keys(localGuardian).length){
    for(const [key, value] of Object.entries(localGuardian)){
      modifiedUpdateData[`localGuardian.${key}`] = value;
    }
  }

  console.log(modifiedUpdateData)

  const result = await StudentModel.findOneAndUpdate( {id}, 
    modifiedUpdateData, {
      new: true,
      runValidators: true,
    }
   )
 
  return result;
};


const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedStudent = await StudentModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const deletedUser = await User.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentsFromDB,
  getUpdateStudentsFromDB,
  deleteStudentFromDB,
};
