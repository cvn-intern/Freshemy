import { Express, Request, Response } from "express";
import validate from "../middlewares/validate";
import { createUserSchema } from "../schema/user.schema";
import { createUserHandler } from "../controllers/user.controller";

const routers = (app: Express) => {
    app.get("/check", (req: Request, res: Response) => res.sendStatus(200));

    app.post("/api/users", validate(createUserSchema), createUserHandler);
};

export default routers;
