import { prismaEdge } from "@dub/prisma/edge";

export const checkIfUserExists = async (userId: string) => {
  const user = await prismaEdge.user.findUnique({ where: { id: userId } });
  return !!user;
};
