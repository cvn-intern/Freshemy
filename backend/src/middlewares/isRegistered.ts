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

            const encodedToken = generateToken(registeredUser.first_name, registeredUser.last_name, registeredUser.password, registeredUser.email);
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

function generateToken(first_name: string, last_name: string, password: string, email: string): string {
    // Generate and return the encoded token based on the user data
    const payload = { first_name, last_name, password, email };
    const secretKey = 'b286e0f96f6759ec8fb9906b235f4c13dfb23c0505574fd6b82abad035f007fa5dac96ac9038beea3abb9bad20a40bd5a7e891e7502539c04dea853e79d10a9f';
    const expiresIn = '1h'; // Set the expiration time for the token

    const token = jwt.sign(payload, secretKey, { expiresIn });

    return token;
}
