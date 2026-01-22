import { DM_Serif_Text } from "next/font/google";

export const fontLogo = DM_Serif_Text({
  variable: "--font-logo",
  weight: ["400"],
});

export const APP_NAME = process.env.NEXT_APP_NAME ?? "WITHCENTER BLOG";
export const APP_TAGLINE =
  process.env.NEXT_APP_TAGLINE ??
  "A blog about nothing—and everything, where life's randomness is gently written down.";

export const INITIAL_TIPTAP_CONTENT: Record<string, any> = {
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "attrs": {
        "textAlign": null,
      },
      content: [
        {
          "type": "text",
          "text": "Write your blog content here... ",
        },
      ],
    },
  ],
};

export const DATE_FORMAT_TEMPLATE = "MMMM DD, YYYY | hh:mm A";

export const PER_PAGE_DEFAULT = 10;
