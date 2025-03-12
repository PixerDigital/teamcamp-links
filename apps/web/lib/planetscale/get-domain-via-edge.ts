import { prismaEdge } from "@dub/prisma/edge";

export const getDomainViaEdge = async (domainSlug: string) => {
  const domain = await prismaEdge.domain.findUnique({
    where: { slug: domainSlug },
  });

  return domain ? domain : null;
};
