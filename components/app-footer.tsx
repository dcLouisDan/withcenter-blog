import { ThemeSwitcher } from "./theme-switcher";

export default function AppFooter() {
  return (
    <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
      <p>
        Developed by{" "}
        <a
          href="https://github.com/dcLouisDan/withcenter-blog"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          Dan Louis M. Dela Cruz
        </a>
      </p>
      <ThemeSwitcher />
    </footer>
  );
}
