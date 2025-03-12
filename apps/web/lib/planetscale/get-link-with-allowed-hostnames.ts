import { prismaEdge } from "@dub/prisma/edge";

export const getLinkWithAllowedHostnames = async (
  domain: string,
  key: string,
) => {
  const data = await prismaEdge.link.findFirst({
    where: {
      domain,
      key,
    },
    select: {
      id: true,
      url: true,
      projectId: true,
      folderId: true,
      userId: true,
      project: {
        select: {
          allowedHostnames: true,
        },
      },
    },
  });

  if (!data) {
    return null;
  }

  const { project, ...rest } = data;
  const allowedHostnames = (project?.allowedHostnames as string[]) || [];

  const formatted = { ...rest, allowedHostnames };

  return formatted;
};
