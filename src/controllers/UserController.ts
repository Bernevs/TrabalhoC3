import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { generateHash } from "../utils/BcryptUtils";

class UserController {
  constructor() {}

  async listUsers(req: Request, res: Response) {
    try {
      const users = await AuthService.listDBUsers();
      res.json({
        status: "ok",
        users: users,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async createUser(req: Request, res: Response) {
    const body = req.body;
    console.log(body);

    if (!body.email || !body.name || !body.password) {
      res.json({
        status: "error",
        message: "Falta parâmetros",
      });
      return;
    }

    const hashPassword = await generateHash(body.password);

    if (!hashPassword) {
      res.json({
        status: "error",
        message: "Erro ao criptografar senha ...",
      });
      return;
    }

    try {
      const newUser = await AuthService.signUp({
        name: body.name,
        email: body.email,
        password: hashPassword,
      });
      res.json({
        status: "ok",
        newUser: newUser,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async updateUser(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.json({
        status: "error",
        message: "Faltou o ID",
      });
      return;
    }

    const { name, email, password } = req.body;
    if (!email || !name) {
      res.json({
        status: "error",
        message: "Falta parâmetros",
      });
      return;
    }

    const updatedData: any = { name, email };
    if (password) {
      const hashPassword = await generateHash(password);
      if (hashPassword) {
        updatedData.password = hashPassword;
      } else {
        res.json({
          status: "error",
          message: "Erro ao criptografar senha ...",
        });
        return;
      }
    }

    try {
      const updatedUser = await AuthService.updateDBUser(
        updatedData,
        parseInt(id)
      );
      res.json({
        status: "ok",
        updatedUser: updatedUser,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.json({
        status: "error",
        message: "Faltou o ID",
      });
      return;
    }

    try {
      const response = await AuthService.deleteDBUser(parseInt(id));
      if (response) {
        res.json({
          status: "ok",
          message: "usuário deletado com sucesso",
        });
      } else {
        res.json({
          status: "error",
          message: "Usuário não encontrado",
        });
      }
    } catch (error) {
      console.log(error);
      res.json({
        status: "error",
        message: error,
      });
    }
  }
}

export default new UserController();
