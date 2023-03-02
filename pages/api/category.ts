import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "../../config/prisma";
import { PostCategorySchema } from "../../types/postCategory";
import { authOptions } from "./auth/[...nextauth]";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  if (req.method === "POST") {
    const { name } = req.body;
    const response = PostCategorySchema.safeParse(req.body);
    if (!response.success)
      return res.status(400).json({ message: response.error.issues });

    try {
      const category = await prisma.category.create({
        data: { name, userId: session?.user?.id },
      });
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Category post error" });
    }
  }
};
