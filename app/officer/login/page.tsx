import { redirect } from "next/navigation";

export default function OfficerLoginPage() {
  redirect("/login?role=officer");
}
