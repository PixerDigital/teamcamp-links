import { prismaEdge } from "@dub/prisma/edge";
import { EdgeLinkProps } from "./types";

export const getShortLinkViaEdge = async (shortLink: string) => {
  const link = await prismaEdge.link.findFirst({ where: { shortLink } });

  return link ? (link as unknown as EdgeLinkProps) : null;
};
