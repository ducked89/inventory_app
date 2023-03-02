import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { prisma } from "../../config/prisma";
import { authOptions } from "./auth/[...nextauth]";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session)
    return res
      .status(401)
      .json({ message: "Unauthorized! You must be logged in." });

  try {
    const categories = await prisma.category.findMany({
      where: {
        userId: session?.user?.id,
      },
      select: {
        Product: {
          select: {
            name: true,
            price: true,
            id: true,
            lastUpdate: true,
            date: {
              select: {
                stock: true,
              },
              take: 1,
            },
          },
        },
        name: true,
        id: true,
      },
    });

    res.status(200).json(categories);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error!" });
  }
  res.end();
};
