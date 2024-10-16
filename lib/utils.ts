import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const addMaximumScaleToMetaViewport = () => {
  const el = document.querySelector("meta[name=viewport]");

  if (el !== null) {
    let content = el.getAttribute("content");
    let re = /maximum\-scale=[0-9\.]+/g;

    if (content && re.test(content)) {
      content = content.replace(re, "maximum-scale=1.0");
    } else if (content) {
      content = [content, "maximum-scale=1.0"].join(", ");
    }

    if (content !== null) {
      el.setAttribute("content", content);
    }
  }
};
export const checkIsIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
