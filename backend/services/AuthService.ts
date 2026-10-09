
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { UserRepository } from "../repositories/UserRepository";

export class AuthService {
  async register(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!name.trim() || !normalizedEmail || !password) {
      throw new Error("Preencha todos os campos.");
    }

    if (password.length < 8) {
      throw new Error("A senha deve ter pelo menos 8 caracteres.");
    }

    const existingUser = await UserRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = UserRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const savedUser = await UserRepository.save(user);

    return {
      message: "Usuário cadastrado com sucesso!",
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email,
      },
    };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await UserRepository.findOne({
      where: { email: normalizedEmail },
    });

    if (!user) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      throw new Error("E-mail ou senha inválidos.");
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não configurado no ambiente.");
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      secret,
      { expiresIn: "1h" }
    );

    return {
      message: "Login realizado com sucesso!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}