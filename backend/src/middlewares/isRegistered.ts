import { RegisterRequest } from '../types/request';
import { Response, NextFunction } from 'express';
import jwt, { TokenExpiredError, JsonWebTokenError, NotBeforeError } from 'jsonwebtoken';
import { MyJwtPayload } from '../types/decodeToken';
import { db } from '../configs/db.config';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import bcrypt from 'bcrypt';

export const isLogin = async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const jsonWebToken = authHeader?.split(' ')[1];

        if (!jsonWebToken) {
            return res.status(401).json({ message: 'Unauthorized' });
        } else {
            const decodeJsonWebToken = jwt.verify(jsonWebToken, 'PrivateKey') as MyJwtPayload;
            if (decodeJsonWebToken) {
                const isFoundUser = await db.user.findUnique({
                    where: {
                        id: decodeJsonWebToken.user_id,
                    },
                });

                if (isFoundUser) {
                    req.user_id = isFoundUser.id;
                }
            }

            // Handle register logic here
            const registeredUser = await registrationUser(req.body);
            if (!registeredUser) {
                return res.status(500).json({ message: 'Failed to register user' });
            }

            const encodedToken = generateToken(registeredUser);
            return res.status(200).json({ token: encodedToken });
        }
    } catch (error: any) {
        if (error instanceof PrismaClientKnownRequestError) {
            return res.status(401).json({ message: error.toString() });
        }
        if (error instanceof TokenExpiredError) {
            return res.status(400).json({ message: error.message });
        } else if (error instanceof JsonWebTokenError) {
            return res.status(400).json({ message: error.message });
        } else if (error instanceof NotBeforeError) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(500).json({ message: 'Internal Server' });
    }
};

async function registrationUser(userData: { email: string; password: string; first_name: string; last_name: string }) {
    // Generate a hashed password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
        const newUser = await db.user.create({
            data: {
                email: userData.email,
                password: hashedPassword,
                first_name: userData.first_name,
                last_name: userData.last_name,
                url_avatar: '', // Add default value or value from userData
                token: '', // Add default value or value from userData
            },
        });
        
        return newUser;
    } catch (error) {
        console.error('Failed to register user:', error);
        return null;
    }
}

function generateToken(user: { id: number }): string {
    // Generate and return the encoded token based on the user object
    // Example:
    const payload: MyJwtPayload = {
        user_id: user.id,
        // Add more payload properties if needed
    };
    const token = jwt.sign(payload, 'PrivateKey', { expiresIn: '1h' });
    return token;
}
