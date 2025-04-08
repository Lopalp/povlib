"use client"
import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  session: null,
  error: null,
});