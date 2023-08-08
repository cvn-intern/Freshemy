import { RequestHasLogin } from "../types/request.type";
import { Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken.type";
import { db } from "../configs/db.config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import configs from "../configs";

import i18n from "../utils/i18next";

export const isAuthor = async (req: RequestHasLogin, res: Response, next: NextFunction) => {
    try {
        const user_id = req.user_id;
        let course_id
        if(req.body.course_id){
            course_id = Number(req.body.course_id)
        }else if (req.params.id){
            course_id = Number(req.params.id)
        }else{
            return res.status(400).json({message: i18n.t("errorMessages.badRequest")})
        }
        const isFoundCourse = await db.course.findFirst({
            where: {
                id: course_id,
                user_id: user_id,
            },
        });
        if (!isFoundCourse) {
            return res.status(403).json({ message: i18n.t("errorMessages.UnAuthorized") });
        }
        next();
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return res.status(401).json({ message: error.toString() });
        }
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: error.message });
        } else if (error instanceof NotBeforeError) {
            return res.status(401).json({ message: error.message });
        }

        return res.status(500).json({ message: i18n.t("errorMessages.internalServer") });
    }
};
