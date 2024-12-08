/* eslint-disable no-unused-vars */
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { StudentRoute } from './app/modules/student/student.route';
import { UserRoute } from './app/modules/user/user.route';
import globalErrorHandler from './app/middlewares/globalErrorhandler';
import notFound from './app/middlewares/notFound';
import { AcademicSemesterRoutes } from './app/modules/academicSemester/academicSemester.route';
import { AcademicFacultyRoutes } from './app/modules/academicFaculty/academicFaculty.route';
import { AcademicDepartmentRoutes } from './app/modules/academicDepartment/academicDepartment.route';


const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

//application route
app.use('/api/v1/students', StudentRoute);
app.use('/api/v1/users', UserRoute);

app.use('/api/v1/academic-semsters', AcademicSemesterRoutes);
app.use('/api/v1/academic-facultys', AcademicFacultyRoutes);

app.use('/api/v1/academic-departments', AcademicDepartmentRoutes);

const getAController = (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/', getAController);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const test = async (req: Request, res: Response) => {
 Promise.reject()
};

app.get('/', test);


app.use(globalErrorHandler);

app.use(notFound);

export default app;
