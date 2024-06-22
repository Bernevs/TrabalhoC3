import { Request, Response } from "express";
import CommentDataBaseService from "../services/CommentDataBaseService";

class CommentController {
  constructor() {}

  async listComments(req: Request, res: Response) {
    try {
      const comments = await CommentDataBaseService.listDBComments();
      res.json({
        status: "ok",
        posts: comments,
      });
    } catch (error) {
      console.log(error);
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async createComment(req: Request, res: Response) {
    const AuthorId = req.params.id;
    const PostId = req.params.body;
    const body = req.body;

    if (!body.title || !AuthorId || !PostId) {
      res.json({
        status: "error",
        message: "Missing parameters",
      });
      return;
    }

    try {
      const newComment = await CommentDataBaseService.insertDBComment({
        content: body.content,
        post: {
          connect: {
            id: parseInt(PostId),
          },
        },
        author: {
          connect: {
            id: parseInt(AuthorId),
          },
        },
      });
      res.json({
        status: "ok",
        newPost: newComment,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async updateComment(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.json({
        status: "error",
        message: "Faltou o ID",
      });
    }

    const { content, post, author } = req.body;
    if (!content || post || author) {
      res.json({
        status: "error",
        message: "Falta parâmetros",
      });
    }

    try {
      const updateComment = await CommentDataBaseService.updateDBComment(
        {
          content: content,
          post: post,
          author: author,
        },
        parseInt(id)
      );
      res.json({
        status: "ok",
        newPost: updateComment,
      });
    } catch (error) {
      res.json({
        status: "error",
        message: error,
      });
    }
  }

  async deleteComment(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) {
      res.json({
        status: "error",
        message: "Faltou o ID",
      });
    }

    try {
      const response = await CommentDataBaseService.deleteDBComment(
        parseInt(id)
      );
      if (response) {
        res.json({
          status: "ok",
          message: "comentario deletado com sucesso",
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

export default new CommentController();
