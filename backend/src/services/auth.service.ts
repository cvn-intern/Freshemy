import { Request } from "express";
import { db } from "../configs/db.config";
import * as bcrypt from "bcrypt";
import jwt, { JsonWebTokenError, TokenExpiredError, NotBeforeError } from "jsonwebtoken";
import { MyJwtPayload } from "../types/decodeToken";
import { ResponseBase, ResponseError, ResponseSuccess } from "../commons/response";

import { RegisterRequest } from "../types/request";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const generateToken = (userId: number): string => {
  const secretKey = 'your-secret-key'; // Replace with your actual secret key
  const expiresIn = '1h';

  const payload = { userId };
  const token = jwt.sign(payload, secretKey, { expiresIn });

  return token;
};

const register = async (req: RegisterRequest): Promise<ResponseBase> => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // Check if the email already exists in the database
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return new ResponseError(400, "Email already exists", false);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user in the database
    const newUser = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        first_name,
        last_name,
        url_avatar: "",
        token: ""
      },
    });

    if (newUser) {
      // Generate a token for the registered user
      const token = generateToken(newUser.id);

      return new ResponseSuccess(200, "Registered successfully", true, { token });
    }

    return new ResponseError(500, "Failed to register user", false);
  } catch (error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
      return new ResponseError(400, "Bad request", false);
    }
    return new ResponseError(500, "Internal Server", false);
  }
};

const refreshToken = async (req: Request): Promise<ResponseBase> => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return new ResponseError(400, 'Refresh token not found', false);
    }

    const decodedToken = jwt.verify(refreshToken, 'PrivateKey') as MyJwtPayload;
    const userId = decodedToken.user_id;

    // Check if the user exists
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new ResponseError(400, 'User not found', false);
    }

    const accessToken = generateToken(user.id);

    return new ResponseSuccess(200, 'Refresh token successful', true, { accessToken });
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return new ResponseError(400, error.message, false);
    } else if (error instanceof JsonWebTokenError) {
      return new ResponseError(401, error.message, false);
    } else if (error instanceof NotBeforeError) {
      return new ResponseError(401, error.message, false);
    }

    return new ResponseError(500, "Internal Server", false);
  }
};

const getMe = async (req: RegisterRequest): Promise<ResponseBase> => {
  try {
    const userId = req.user_id;

    const isFoundUser = await db.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (isFoundUser) {
      const userInformation = {
        user_id: isFoundUser.id,
        email: isFoundUser.email,
        first_name: isFoundUser.first_name,
        last_name: isFoundUser.last_name,
      };
      return new ResponseSuccess(200, "Request successful", true, userInformation);
    }

    return new ResponseError(401, "Unauthorized", false);
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return new ResponseError(400, error.message, false);
    } else if (error instanceof JsonWebTokenError) {
      return new ResponseError(401, error.message, false);
    } else if (error instanceof NotBeforeError) {
      return new ResponseError(401, error.message, false);
    }

    return new ResponseError(500, "Internal Server", false);
  }
};

const AuthService = {
  register,
  refreshToken,
  getMe,
};

export default AuthService;
