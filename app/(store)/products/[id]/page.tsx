import StoreProductDetailClient from "@/components/store/StoreProductDetailClient";

export default async function StoreProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <StoreProductDetailClient id={id} />;
}
