import { Request } from "express";
import configs from "../configs";
import { db } from "../configs/db.config";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import {
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_MISSING_REQUEST_BODY,
    MESSAGE_SUCCESS_GET_DATA,
    MESSAGE_SUCCESS_CREATE_DATA,
    MESSAGE_SUCCESS_UPDATE_DATA,
    MESSAGE_SUCCESS_DELETE_DATA,
} from "../utils/constant";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";

const getAllSectionByCourseId = async (req: Request): Promise<ResponseBase> => {
    try {
        const { course_id } = req.params;
        const isFoundSection = await configs.db.section.findMany({
            where: {
                course_id: parseInt(course_id),
                is_delete: false,
            },
            include: {
                lessons: {
                    select: {
                        title: true,
                        id: true,
                        url_video: true,
                        updated_at: true,
                    }
                }
            }
        });
        if (isFoundSection) return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_DATA, true, isFoundSection);
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const createSection = async (req: Request): Promise<ResponseBase> => {
    try {
        const { title, course_id } = req.body;
        const section = await configs.db.section.create({
            data: {
                title: title,
                course_id: course_id,
            },
        });
        if (section) return new ResponseSuccess(201, MESSAGE_SUCCESS_CREATE_DATA, true);
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const updateSection = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const section_id = +id;
        const section = await configs.db.section.update({
            where: {
                id: section_id,
            },
            data: {
                title: title,
            },
        });
        if (section) return new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATE_DATA, true);
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const deleteSection = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const section_id = +id;
        const isDelete = await configs.db.section.update({
            where: {
                id: section_id,
            },
            data: {
                is_delete: true,
            },
        });
        if (isDelete) return new ResponseSuccess(200, MESSAGE_SUCCESS_DELETE_DATA, true);
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, error.toString(), false);
        }
        if (error instanceof TokenExpiredError) {
            return new ResponseError(400, error.message, false);
        } else if (error instanceof JsonWebTokenError) {
            return new ResponseError(401, error.message, false);
        } else if (error instanceof NotBeforeError) {
            return new ResponseError(401, error.message, false);
        }

        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};
const SectionService = {
    getAllSectionByCourseId,
    createSection,
    updateSection,
    deleteSection,
};
export default SectionService;
