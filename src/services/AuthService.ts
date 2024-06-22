import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

class AuthService {
  constructor() {}

  async signIn(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (user && (await bcrypt.compare(password, user.password))) {
        return user;
      }
      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async signUp(user: Prisma.UserCreateInput & { password: string }) {
    try {
      const newUser = await prisma.user.create({
        data: user,
      });
      return newUser;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async signOut() {
    // Implementar lógica de logout, se necessário
  }

  async listDBUsers() {
    try {
      return await prisma.user.findMany();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async updateDBUser(data: Prisma.UserUpdateInput, userId: number) {
    try {
      return await prisma.user.update({
        where: { id: userId },
        data: data,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteDBUser(userId: number) {
    try {
      return await prisma.user.delete({
        where: { id: userId },
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new AuthService();
