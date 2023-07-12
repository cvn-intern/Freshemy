import { Prisma, PrismaClient } from "@prisma/client";
import { omit } from "lodash";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function createUser(input: Prisma.UserCreateInput) {
    try {
        const user = await prisma.user.create({
            data: input,
        });

        return omit(user, "password");
    } catch (e: any) {
        throw new Error(e);
    }
}

export async function validatePassword({ email, password }: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return false;
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) return false;

    return omit(user, "password");
}

export async function findUser(query: Prisma.UserFindFirstArgs) {
    return prisma.user.findFirst(query);
}
