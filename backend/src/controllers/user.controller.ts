import { Request, Response } from "express";
import { omit } from "lodash";
import { PrismaClient } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

type CreateUserInput = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    try {
        const user = await prisma.user.create({
            data: {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
                url_avatar: "", // Provide a default value or make it optional
                token: "", // Provide a default value or make it optional
            },
        });
        return res.send(user);
    } catch (e: any) {
        logger.error(e);
        return res.status(400).send(e.message);
    }
}
