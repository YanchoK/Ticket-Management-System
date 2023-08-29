// import AppError from "../AppError"
import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import * as Joi from 'joi'; // Import Joi

const errorHandler = (error: AppError | Error,
    req: Request, res: Response, next: NextFunction) => {

    console.log(error);

    if (Joi.isError(error) && 'isJoi' in error && error['isJoi']) {
        return res.status(400).send({
            type: 'ValidationError',
            message: error.message,
        });
    }
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            errorCode: error.errorCode,
        });
    }

    return res.status(500).send("Something went wrong");
    // return res.status(400).send("I was hereeeee!!!!!!!!!!")
};

export default errorHandler;