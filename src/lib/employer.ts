
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireEmployer() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYER") {
    redirect("/login");
  }

  return session.user;
}
