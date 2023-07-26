import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";
import {
    MESSAGE_ERROR_INTERNAL_SERVER,
    MESSAGE_ERROR_BAD_REQUEST,
    MESSAGE_SUCCESS_GET_ALL_CATEGORIES,
} from "../utils/constant";
import { db } from "../configs/db.config";


export const getAllCategories = async ():Promise<ResponseBase> => {
    try {
        const categories = await db.category.findMany();
        return new ResponseSuccess(200, MESSAGE_SUCCESS_GET_ALL_CATEGORIES, true, categories);
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, MESSAGE_ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, MESSAGE_ERROR_INTERNAL_SERVER, false);
    }
};

const CategoryService = {
    getAllCategories,
};

export default CategoryService;
