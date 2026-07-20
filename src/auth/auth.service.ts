import "dotenv/config";
import prisma from "../config/db.ts";
import bcrypt from 'bcrypt';
import type { LoginDto, SignupDto } from "./dto/signup.schema.ts";
import { JwtService } from "./jwt.service.ts";

export class AuthService {
  private jwtSevice = new JwtService();
  async signup(signupDto: SignupDto) {
    if (!signupDto.name || !signupDto.email || !signupDto.password) {
      throw new Error("Name, email and password is required");
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: signupDto.email
      }
    })
    if (existingUser) {
      throw new Error("Email already exists")
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await prisma.user.create({
      data: {
        name: signupDto.name,
        email: signupDto.email,
        passwordHash: hashedPassword
      }
    });
    const newUser = {
      id: user.id,
      name: user.name,
      email: user.email
    }

    const token = this.jwtSevice.generateAccessToken(newUser.id);
    return { user: newUser, accessToken: token }
  }

  async login(loginDto: LoginDto) {
    if (!loginDto.email || !loginDto.password) {
      throw new Error("Email and password is required");
    }
    const user = await prisma.user.findUnique({
      where: {
        email: loginDto.email,
      }
    });
    if (!user) {
      throw new Error("User Not Found");
    }
    const isSame = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isSame) throw new Error("Wrong password");
    const userObject = {
      name: user.name,
      email: user.email,
      id: user.id
    }

    const token = this.jwtSevice.generateAccessToken(user.id);

    return {
      user: userObject,
      accessToken: token
    }
  }
}