import mongoose from "mongoose";
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicatedError = (err:any) : TGenericErrorResponse => {

    // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources =[
    {
    path: '',
    message: `${extractedMessage} is already exists`,
}
]

const statusCode = 400;

    return {
      statusCode,
      message: 'Invalid Id',
      errorSources,
    };
}

export default handleDuplicatedError;