import { ACCESS } from "@/constants/token";
import { PrismaClient } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const prisma = new PrismaClient();

export const verifyToken = async (req: NextRequest) => {
  const cookie = cookies().get("RefreshToken");
  if (!cookie)
    return {
      user: null,
      newAccessToken: null,
      status: 401,
      isError: true,
      message: "unauthorized, refresh token not found",
    };

  const { value } = cookie;
  const users = await prisma.user.findMany({
    where: {
      refreshToken: value,
    },
    select: {
      id: true,
      name: true,
      username: true,
    },
  });
  if (!users.length)
    return {
      user: null,
      newAccessToken: null,
      status: 401,
      isError: true,
      message: "unauthorized, refresh token broken",
    };

  const id = users[0].id;
  const name = users[0].name;
  const username = users[0].username;
  const getToken = req.headers.get("Authorization");
  if (!getToken)
    return {
      user: null,
      newAccessToken: null,
      status: 401,
      isError: true,
      message: "unauthorized, access token not found",
    };

  const token = getToken.split(" ")[1];

  try {
    const decoded = verify(token, ACCESS);
    return {
      user: users[0],
      newAccessToken: null,
      status: 200,
      isError: false,
      message: "successfully get me",
    };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      const newAccessToken = sign({ id, name, username }, ACCESS, {
        expiresIn: "15m",
      });

      return {
        user: users[0],
        newAccessToken,
        status: 201,
        isError: false,
        message: "token expired. Successfully get new token",
      };
    }
    if (error.name === "JsonWebTokenError")
      return {
        user: null,
        newAccessToken: null,
        status: 401,
        isError: true,
        message: "invalid access token",
      };
    // return response(401, "invalid access token", "error");
  }

  // const getToken = req.headers.get("Authorization");
  // if (!getToken)
  //   return {
  //     data: "unauthorized",
  //     status: 401,
  //   };

  // const token = getToken.split(" ")[1];
  // const cookie = cookies().get("RefreshToken");
  // if (!cookie)
  //   return {
  //     data: "refresh token not found",
  //     status: 404,
  //   };

  // const { value } = cookie;
  // try {
  //   verify(token, ACCESS);

  //   const user = await prisma.user.findMany({
  //     where: {
  //       refreshToken: value,
  //     },
  //   });
  //   if (!user.length)
  //     return {
  //       data: "refresh token is broken",
  //       status: 401,
  //     };
  //   return {
  //     data: value,
  //     status: 200,
  //   };
  // } catch (error) {
  //   return {
  //     data: error,
  //     status: 403,
  //   };
  // }
};
