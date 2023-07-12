import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";


const prisma = new PrismaClient();

// Define your Prisma schema
const userSchema = z.object({
    first_name: z.string().nonempty(),
    last_name: z.string().nonempty(),
    email: z.string().email(),
});

const validate = (schema: z.Schema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate the request data against the schema
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });

        const { email } = req.body;
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new Error("Email already exists");
        }

        next();
    } catch (e: any) {
        return res.status(400).send(e.errors);
    }
};

export default validate;
