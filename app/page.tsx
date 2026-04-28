import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");
  if (session.user.role === "ADMIN") redirect("/admin");
  redirect("/medico");
}
