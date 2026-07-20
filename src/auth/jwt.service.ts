import "dotenv/config";
import jwt from "jsonwebtoken";
interface AccessTokenPayload {
  userId: string;
}
const SECRET_KEY = process.env.JWT_SECRET;
export class JwtService {
  generateAccessToken(userId: string) {
    if (!SECRET_KEY) throw new Error("Secret key not found in env file");
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
    return token;
  }
  verifyAccessToken(token: string): AccessTokenPayload {
    if(!SECRET_KEY) throw new Error("Secret key not found in env file");
    try {
      const payload = jwt.verify(token, SECRET_KEY) as AccessTokenPayload;
      return payload;
    } catch(error: any) {
      if(error instanceof Error && error.name === 'TokenExpiredError') {
        throw new Error("TOKEN_EXPIRED")
      }
      throw new Error("INVALID_TOKEN");
    }
  }
}