import { DM_Serif_Text } from "next/font/google";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { SortDirection } from "./types/blog";

export const fontLogo = DM_Serif_Text({
  variable: "--font-logo",
  weight: ["400"],
});

export const APP_NAME = process.env.NEXT_APP_NAME ?? "WITHCENTER BLOG";
export const APP_TAGLINE =
  process.env.NEXT_APP_TAGLINE ??
  "A blog about nothing—and everything, where life's randomness is gently written down.";

export const BLOG_IMAGES_BUCKET =
  process.env.NEXT_BLOG_IMAGES_BUCKET ?? "blog_images";

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
export const SORT_DEFAULT = "created_at";
export const SORT_DIRECTION_DEFAULT: SortDirection = "desc";

export const TIPTAP_STATIC_RENDERER_EXTENSTIONS = [
  StarterKit,
  Image,
  TextAlign,
  TaskList,
  TaskItem,
  Highlight,
  Typography,
  Superscript,
  Subscript,
  Selection,
];
