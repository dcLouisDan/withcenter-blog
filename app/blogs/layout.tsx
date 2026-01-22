import AppHeader from "@/components/app-header";
import AppFooter from "@/components/app-footer";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="flex-1 w-full flex flex-col gap-4 items-center">
        <AppHeader />
        <div className="flex-1 flex flex-col w-full max-w-6xl p-5">
          {children}
        </div>
        <AppFooter />
      </div>
    </main>
  );
}
