
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface TokenPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      message: "Token de autenticação não informado.",
    });
    return;
  }

  const [scheme, token] = authorization.split(" ");

  if (scheme !== "Bearer" || !token) {
    res.status(401).json({
      message: "Formato do token inválido.",
    });
    return;
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      message: "Configuração de autenticação ausente.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      typeof decoded.id !== "number" ||
      typeof decoded.email !== "string"
    ) {
      res.status(401).json({
        message: "Token inválido.",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    next();
  } catch {
    res.status(401).json({
      message: "Token inválido ou expirado.",
    });
  }
}