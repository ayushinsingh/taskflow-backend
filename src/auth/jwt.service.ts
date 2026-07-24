import "dotenv/config";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/app-error.ts";
interface AccessTokenPayload {
  userId: string;
}
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRY_DURATION = "1d";
export class JwtService {
  generateAccessToken(userId: string) {
    if (!SECRET_KEY) throw new Error("Secret key not found in env file");
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: TOKEN_EXPIRY_DURATION });
    return token;
  }
  verifyAccessToken(token: string): AccessTokenPayload {
    if(!SECRET_KEY) throw new Error("Secret key not found in env file");
    try {
      const payload = jwt.verify(token, SECRET_KEY) as AccessTokenPayload;
      return payload;
    } catch(error: any) {
      if(error instanceof Error && error.name === 'TokenExpiredError') {
        throw new UnauthorizedError("Session expired, please login again")
      }
      throw new UnauthorizedError("Invalid token");
    }
  }
}