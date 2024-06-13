import prisma from "../../../../prisma/prismadb";

export default async function getProducts() {
  const products = await prisma.product.findMany();
  return products;
}
