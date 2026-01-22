import { APP_NAME, fontLogo } from "@/lib/constants";
import Link from "next/link";

export default function AppLogo() {
  return (
    <Link href="/" className={fontLogo.className}>
      {APP_NAME}
    </Link>
  );
}
