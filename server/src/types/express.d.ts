import { IUser } from "./userModel.types";

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}