"use server";

import { prisma } from "@dub/prisma";
import { waitUntil } from "@vercel/functions";
import { z } from "zod";
import { verifyFolderAccess } from "../../folder/permissions";
import { folderUserRoleSchema } from "../../zod/schemas/folders";
import { authActionClient } from "../safe-action";

const schema = z.object({
  workspaceId: z.string(),
  folderId: z.string(),
  userId: z.string(),
  role: folderUserRoleSchema.nullable(),
});

// Update the folder user role
export const updateUserRoleInFolder = authActionClient
  .schema(schema)
  .action(async ({ ctx, parsedInput }) => {
    const { workspace, user } = ctx;
    const { folderId, userId, role } = parsedInput;

    if (user.id === userId) {
      throw new Error("You cannot update your own role.");
    }

    // throw error if plan is free or pro

    await verifyFolderAccess({
      workspaceId: workspace.id,
      userId: user.id,
      folderId,
      requiredPermission: "folders.users.write",
    });

    await prisma.folderUser.upsert({
      where: {
        folderId_userId: {
          folderId,
          userId,
        },
      },
      update: {
        role,
      },
      create: {
        folderId,
        userId,
        role,
      },
    });

    waitUntil(
      (async () => {
        try {
          await prisma.folderAccessRequest.delete({
            where: {
              folderId_userId: {
                folderId,
                userId,
              },
            },
          });
        } catch (error) {
          if (error.code !== "P2025") {
            console.error("Error deleting folder access request", error);
          }
        }
      })(),
    );
  });
