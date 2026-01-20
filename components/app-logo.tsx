import { APP_NAME } from "@/lib/constants";
import Link from "next/link";

export default function AppLogo() {
  return <Link href="/">{APP_NAME}</Link>;
}
