import { twMerge } from "tailwind-merge";
import clsx from "clsx";
function saveDataStorage(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getDataStorage(key: string) {
  const data = localStorage.getItem(key);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

export { saveDataStorage, getDataStorage, cn };
