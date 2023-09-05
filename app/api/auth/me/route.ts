import { response } from "@/constants/response";
import { me } from "@/controllers/UserController";
import { verifyToken } from "@/middleware/verifyToken";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  return await me(req);
};
