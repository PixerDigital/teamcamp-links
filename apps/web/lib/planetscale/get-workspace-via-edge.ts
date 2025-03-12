import { prismaEdge } from "@dub/prisma/edge";

export const getWorkspaceViaEdge = async (workspaceId: string) => {
  const workspace = await prismaEdge.project.findUnique({
    where: { id: workspaceId.replace("ws_", "") },
  });

  return workspace ? workspace : null;
};
