// app/admin/page.tsx  (server component)
async function getData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/admin?type=pending`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to load admin data");
  return res.json();
}

export default async function AdminPage() {
  const { rows } = await getData();
  // render rows...
  return <pre>{JSON.stringify(rows, null, 2)}</pre>;
}
