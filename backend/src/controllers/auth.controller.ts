import { Request, Response } from 'express';
import { registrationSchema } from '../validations/auth';
import { ValidationError } from 'joi';
import { convertJoiErrorToString } from '../commons/index';
import { RegisterRequest } from '../types/request';
import services from '../services/index.service';

class AuthController {
    async register(req: Request, res: Response): Promise<Response> {
        console.log(req.body.email);
        const errorValidate: ValidationError | undefined = registrationSchema.validate(
            req.body
        ).error;

        if (errorValidate) {
            return res.status(400).json({
                status_code: 400,
                message: convertJoiErrorToString(errorValidate),
                success: false,
            });
        }

        const response = await services.AuthService.register(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async refreshToken(req: Request, res: Response): Promise<Response> {
        const response = await services.AuthService.refreshToken(req);

        return res.status(response.getStatusCode()).json(response);
    }

    async getMe(req: RegisterRequest, res: Response): Promise<Response> {
        const response = await services.AuthService.getMe(req);

        console.log(response);
        return res.status(response.getStatusCode()).json(response);
    }
}

export default AuthController;
