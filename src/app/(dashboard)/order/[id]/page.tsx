import { Metadata } from "next";
import { SearchParams } from "nuqs";
import { queryParamsSchema } from "@/lib/utils";
import MenuOrderManagement from "./_components/menu-order";
import Script from "next/script";
import { environment } from "@/configs/environment";

export const metadata: Metadata = {
  title: "Detail Order - POS Realtime",
};

declare global {
  interface Window {
    snap: any;
  }
}

interface DetailOrderPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ id: string }>;
}

export default async function DetailOrderPage({
  searchParams,
  params,
}: DetailOrderPageProps) {
  const resolvedQueryParams = await searchParams;
  const resolvedParams = await params;
  const query = await queryParamsSchema.parseAsync(resolvedQueryParams);
  const orderId = resolvedParams.id;

  return (
    <>
      <Script
        src={`${environment.MIDTRANS_API_URL}/snap/snap.js`}
        data-client-key={environment.MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />
      <MenuOrderManagement query={query} orderId={orderId} />
    </>
  );
}
