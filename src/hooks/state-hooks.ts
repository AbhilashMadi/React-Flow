
import { useContext } from "react";
import { appContext } from "@/context/app-context";

export const useData = () => {
  return useContext(appContext);
}