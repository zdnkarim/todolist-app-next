import { PrismaClient } from "@prisma/client";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import { response } from "@/constants/response";
import { sign } from "jsonwebtoken";
import { ACCESS, REFRESH } from "@/constants/token";
import { cookies } from "next/headers";
import { verifyToken } from "@/middleware/verifyToken";

const prisma = new PrismaClient();

export const register = async (req: NextRequest) => {
  const salt = await bcrypt.genSalt();
  const body = await req.json();
  const { name, username, password, confirmPassword } = body;
  if (!password || !confirmPassword)
    return response(
      400,
      "The password or confirm password must be filled!",
      "invalid"
    );

  if (password !== confirmPassword)
    return response(
      400,
      "The password and confirm password do not match!",
      "invalid"
    );

  const hashPassword = await bcrypt.hash(password, salt);
  try {
    const user = await prisma.user.create({
      data: {
        name: name,
        username: username,
        password: hashPassword,
      },
    });
    const data = {
      id: user.id,
      name: user.name,
      username: user.username,
      isRegistered: true,
    };
    return response(201, data, "Successfully registered a new account");
  } catch (error: any) {
    if (error.name === "PrismaClientKnownRequestError") {
      return response(400, `${error.meta.target} is exist`, "error");
    }
    console.log(error);
  }
};
export const login = async (req: NextRequest) => {
  const body = await req.json();

  const users = await prisma.user.findMany({
    where: {
      username: body.username,
    },
  });
  if (!users.length) return response(404, "Username is not found", "not found");
  const match = await bcrypt.compare(body.password, users[0].password);
  if (!match) return response(400, "Wrong password", "invalid");
  const id = users[0].id;
  const name = users[0].name;
  const userName = users[0].username;

  const access = sign({ id, name, userName }, ACCESS, { expiresIn: "15m" });
  const refresh = sign({ id, name, userName }, REFRESH, { expiresIn: "1d" });

  try {
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        refreshToken: refresh,
      },
    });
    const data = {
      userName: userName,
      isLogin: true,
      accessToken: access,
    };
    cookies().set("RefreshToken", refresh, { maxAge: 24 * 60 * 60 });
    return response(200, data, `Successfully logged in as ${name}`);
  } catch (error: any) {
    if (error.name === "PrismaClientKnownRequestError") {
      return response(400, `${error.meta.target} is exist`, "error");
    }
    console.log(error);
  }
};

type verifyResponse =
  | {
      user: { id: number; name: string; username: string } | null;
      newAccessToken: string | null;
      status: number;
      isError: boolean;
      message: string;
    }
  | undefined;

export const me = async (req: NextRequest) => {
  const verif: verifyResponse = await verifyToken(req);
  if (verif) {
    if (verif.isError) return response(verif.status, verif.message, "error");
    return response(
      verif.status,
      { user: verif.user, accessToken: verif.newAccessToken },
      verif.message
    );
  }
};
export const logout = async (req: NextRequest) => {
  const verif: verifyResponse = await verifyToken(req);
  if (verif) {
    if (verif.isError) return response(verif.status, verif.message, "error");
    if (verif.user) {
      try {
        await prisma.user.update({
          where: {
            username: verif.user.username,
          },
          data: {
            refreshToken: "",
          },
        });
        cookies().delete("RefreshToken");
        return response(200, "successfully logged out", "success");
      } catch (error) {
        return response(400, error, "error");
      }
    }
  }
};
