import { notFound } from "next/navigation";
import { PageForm } from "@/components/page-form";
import { getPage } from "@/lib/data";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await getPage(id);
  if (!page) notFound();

  return (
    <div>
      <h1 className="mb-8 font-serif text-4xl">Edit page</h1>
      <PageForm initial={page} />
    </div>
  );
}
