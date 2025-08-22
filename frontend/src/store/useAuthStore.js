import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigninUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,   
    
    checkAuth: async() => {
        try {
            const response = await axiosInstance.get("/auth/check");
            set({ authUser: response.data });
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (formData) => {
        try {
            const response = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: response.data });
        } catch (error) {
            console.log(error);
            set({ authUser: null });
        } finally {
            set({ isSigninUp: false });
        }
    },
    
}))


