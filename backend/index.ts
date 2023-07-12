import express, { Application, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

//////////////////////////////////////////////////////////////////////////
import routers from "./src/routes/user.router";
import configs from "./src/configs";
import authRouter from './src/routes/auth.router';

//////////////////////////////////////////////////////////////////////////
import validate from "./src/middlewares/validate";
import { createUserSchema } from "./src/schema/user.schema";
import { createUserHandler } from "./src/controllers/user.controller";

// const app: Application = express();
const prisma = new PrismaClient();
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port: number = configs.general.PORT;

app.get("/", (_req, res: Response) => {
    res.send(`Server is running on port 11111111111111: ${port}`);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    // routers(app);
});

app.get("/check", (req: Request, res: Response) => res.sendStatus(200));

app.post("/api/users", createUserHandler);
