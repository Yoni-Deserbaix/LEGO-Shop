import AccesDenied from "../../../../components/ui/AccesDenied";
import { getCurrentUser } from "../../../../pages/api/auth/getCurrentUser";
import getProducts from "../../../../pages/api/auth/getProducts";
import ManageProductsClient from "./ManageProductsClient";

export const revalidate = 0;

export default async function page() {
  const products = await getProducts();
  const currentUser = await getCurrentUser();

  // Check if the current user is not authenticated or is not an admin
  if (!currentUser || currentUser.role !== "ADMIN") {
    return <AccesDenied title="Oops! Acces denied" />;
  }
  return (
    <div>
      <ManageProductsClient products={products} />
    </div>
  );
}
