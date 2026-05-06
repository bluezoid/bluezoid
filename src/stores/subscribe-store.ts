import { create } from "zustand";

type SubscribeState = {
  email: string;
  status: "idle" | "loading" | "success" | "error";
  message: string;

  setEmail: (email: string) => void;
  setStatus: (status: SubscribeState["status"]) => void;
  setMessage: (msg: string) => void;
  reset: () => void;
};

export const useSubscribeStore = create<SubscribeState>()((set) => ({
  email: "",
  status: "idle",
  message: "",

  setEmail: (email) => set({ email }),
  setStatus: (status) => set({ status }),
  setMessage: (message) => set({ message }),
  reset: () => set({ email: "", status: "idle", message: "" }),
}));
