type ClassValue = string | number | null | undefined | boolean | { [key: string]: any } | ClassValue[];

function clsx(...inputs: ClassValue[]) {
  const classes: string[] = [];

  function handle(input: ClassValue) {
    if (!input) return;
    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
    } else if (Array.isArray(input)) {
      for (const i of input) handle(i);
    } else if (typeof input === "object") {
      for (const key in input) {
        if (Object.prototype.hasOwnProperty.call(input, key) && (input as any)[key]) {
          classes.push(key);
        }
      }
    }
  }

  for (const input of inputs) {
    handle(input);
  }

  return classes.join(" ");
}

import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
