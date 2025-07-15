import { create } from "zustand";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastState {
    message: string | null;
    type: ToastType;
    setToast: (message: string, type: ToastType) => void;
    clearToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
    message: null,
    type: "success",
    setToast: (message, type) => set({ message, type }),
    clearToast: () => set({ message: null }),
}));
