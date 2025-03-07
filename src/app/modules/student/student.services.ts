/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import mongoose from 'mongoose';
import { StudentModel } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status'
import { Student } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
 
  // const queryObj = {...query}

  //  const studentSearchableFields =  ['email', 'name.firstName', 'presentAddress']
  // let searchTerm = '';

  // if(query?.searchTerm){
  //   searchTerm = query?.searchTerm as string
  // } 

  // const searchQuery = StudentModel.find(
  //   {
  //    $or:studentSearchableFields.map((field) => ({
  //      [field]: { $regex: searchTerm, $options: 'i' },
  //    })),
  //   }
  //  )

   //Filtering
  //  const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
  //  excludeFields.forEach((el) => delete queryObj [el])
  //  console.log( {query}, {queryObj})

  // const filterQuery = searchQuery
  // .find(queryObj)  
  // .populate('admissionSemester')
  // .populate({
  //   path: 'academicDepartment',
  //   populate: {
  //     path: 'academicFaculty'
  //   }
  // });

  // let sort = '-createdAt';

  // if(query.sort){
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // let page = 1
  // let limit = 1;
  // let skip = 0;

  
  // if(query.limit){
  //   limit = Number(query.limit)
  // }


  // if(query.page){
  //   page = Number(query.page)
  //   skip = (page - 1)
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery = paginateQuery.limit(limit)

  // let fields = '-__v';

  // if(query.fields){
  //   fields = (query.fields as string).split(',').join(' ');
  //   console.log({fields})
  // }

  // const fieldQuery = await limitQuery.select(fields);

  // return fieldQuery;

  const studentQuery = new QueryBuilder(
    StudentModel.find()
    .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
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

  const result = await StudentModel.findByIdAndUpdate( id, 
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

    const deletedStudent = await StudentModel.findByIdAndUpdate(
       id ,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }

    const userId = deletedStudent.user

    const deletedUser = await User.findByIdAndUpdate(
      userId ,
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
