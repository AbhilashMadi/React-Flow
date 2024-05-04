
import { useContext } from "react";
import { appContext } from "@/context/app-context";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store";

export const useData = () => {
  return useContext(appContext);
}

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()