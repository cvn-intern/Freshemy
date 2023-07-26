import { Request } from "express";
import configs from "../configs";
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
import { RequestHasLogin } from "../types/request";
import services from ".";
import { resolutions } from "../commons";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const getLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const lesson_id = +id;
        const isFoundLesson = await configs.db.lesson.findFirst({
            where: {
                id: lesson_id,
                is_delete: false,
            },
        });
        const data = {
            id: isFoundLesson?.id,
            url_video: isFoundLesson?.url_video,
        };
        if (isFoundLesson) return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_DATA, true, data);
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

const createLesson = async (req: RequestHasLogin): Promise<ResponseBase> => {
    try {
        const { title, section_id } = req.body;

        const sectionIdConvert = parseInt(section_id);
        const uuid = uuidv4();

        const videoPath = await services.FileStorageService.createFileM3U8AndTS(
            req.file as Express.Multer.File,
            resolutions,
            configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
            uuid,
        );

        const lesson = await configs.db.lesson.create({
            data: {
                title: title,
                section_id: sectionIdConvert,
                url_video: videoPath,
            },
        });
        if (lesson) {
            return new ResponseSuccess(200, MESSAGE_SUCCESS_CREATE_DATA, true);
        } else {
            fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, uuid));
            fs.unlinkSync(req.file?.path as string);
        }
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

const updateLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const lesson_id = +id;
        if (req.file) {
            const isFoundLesson = await configs.db.lesson.findUnique({
                where: {
                    id: lesson_id,
                },
            });

            if (!isFoundLesson) {
                return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
            }

            const urlVideoSplit = isFoundLesson.url_video.split(`${configs.general.PUBLIC_URL_FOLDER_VIDEOS}`);
            const nameFolder = urlVideoSplit[1].split("/")[1];
            if (!nameFolder) {
                return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
            }
            fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, nameFolder));

            const videoPath = await services.FileStorageService.createFileM3U8AndTS(
                req.file as Express.Multer.File,
                resolutions,
                configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS,
                nameFolder,
            );

            const lesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title: title,
                    url_video: videoPath,
                },
            });

            if (lesson) {
                return new ResponseSuccess(200, MESSAGE_SUCCESS_CREATE_DATA, true);
            } else {
                fs.unlinkSync(path.join(configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS, nameFolder));
                fs.unlinkSync(req.file?.path as string);
            }
        } else {
            const lesson = await configs.db.lesson.update({
                where: {
                    id: lesson_id,
                },
                data: {
                    title: title,
                },
            });
            if (lesson) return new ResponseSuccess(200, MESSAGE_SUCCESS_UPDATE_DATA, true);
        }
        return new ResponseError(400, MESSAGE_ERROR_MISSING_REQUEST_BODY, false);
    } catch (error: any) {
        fs.unlinkSync(req.file?.path as string);
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

const deleteLesson = async (req: Request): Promise<ResponseBase> => {
    try {
        const { id } = req.params;
        const lesson_id = +id;
        const isDelete = await configs.db.lesson.update({
            where: {
                id: lesson_id,
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
const LessonService = {
    getLesson,
    createLesson,
    updateLesson,
    deleteLesson,
};
export default LessonService;
