import { PrismaClient, User } from "@prisma/client";
import bcrypt from "bcrypt";
import config from "config";

const prisma = new PrismaClient();

interface UserInput {
    email: string;
    first_name: string;
    last_name: string;
    password: string;
}

async function createUser(userInput: UserInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(userInput.password, config.get<number>("saltWorkFactor"));

    return prisma.user.create({
        data: {
            email: userInput.email,
            first_name: userInput.first_name,
            last_name: userInput.last_name,
            password: hashedPassword,
            url_avatar: "", // Provide a default value or make it optional
            token: "", // Provide a default value or make it optional
        },
    });
}

async function comparePassword(userId: number, candidatePassword: string): Promise<boolean> {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
        return false;
    }

    return bcrypt.compare(candidatePassword, user.password);
}

export { createUser, comparePassword };
