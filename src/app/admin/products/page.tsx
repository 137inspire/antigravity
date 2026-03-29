import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import AdminProductList from "@/components/AdminProductList";

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const products = await prisma.product.findMany({
    orderBy: { name: 'asc' }
  });

  async function addProduct(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const weight = formData.get("weight") ? parseFloat(formData.get("weight") as string) : 0.0;
    const image = formData.get("image") as string;
    const isPublished = formData.get("isPublished") === 'on';

    await prisma.product.create({
      data: { name, description, price, weight, image, isPublished }
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
  }

  async function deleteProduct(id: string) {
    "use server";
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
  }

  async function togglePublish(id: string, current: boolean) {
    "use server";
    await prisma.product.update({ 
      where: { id },
      data: { isPublished: !current }
    });
    revalidatePath("/admin/products");
    revalidatePath("/products");
  }

  return (
    <AdminProductList 
      products={products} 
      onAdd={addProduct} 
      onDelete={deleteProduct} 
      onTogglePublish={togglePublish}
    />
  );
}
