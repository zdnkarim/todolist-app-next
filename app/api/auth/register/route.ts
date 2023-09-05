import { register } from "@/controllers/UserController";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
  return await register(req);
};
