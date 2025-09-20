import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { useQueryClient, useMutation, useQuery, QueryClient, dehydrate, QueryClientProvider } from "@tanstack/react-query";
import { useNavigate, Link, useParams, useLocation, Routes, Route, Navigate } from "react-router";
import toast, { Toaster } from "react-hot-toast";
import { EarthIcon, CameraIcon, MapPinIcon, LoaderIcon, Disc3Icon, PaletteIcon, BellIcon, UsersIcon, LogOutIcon, HomeIcon, Github, Twitter, Linkedin, CheckCircleIcon, UserPlusIcon, UserCheckIcon, ClockIcon, MessageSquareIcon, MessageSquare, X, Image, Send, ArrowLeft, Camera, User, Mail } from "lucide-react";
import axios from "axios";
import { create } from "zustand";
import { io } from "socket.io-client";
import { AnimatePresence, motion } from "framer-motion";
const axiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true
});
const createSsrConfig = (cookie) => {
  return typeof cookie === "string" && cookie ? { headers: { Cookie: cookie } } : {};
};
const getAuthUser = async (cookie) => {
  try {
    const res = await axiosInstance.get("/api/auth/me", createSsrConfig(cookie));
    return res.data;
  } catch (error2) {
    console.log("error in getAuthUser ", error2);
    throw error2;
  }
};
const getRecommUser = async (cookie) => {
  const res = await axiosInstance.get("/api/users", createSsrConfig(cookie));
  return res.data;
};
const getOutgoingFriendReqs = async (cookie) => {
  const res = await axiosInstance.get("/api/users/outgoing-friends-request", createSsrConfig(cookie));
  return res.data;
};
const getFriendReqs = async (cookie) => {
  const res = await axiosInstance.get("/api/users/friend-requests", createSsrConfig(cookie));
  return res.data;
};
const getUserFriends = async (cookie) => {
  const res = await axiosInstance.get(`/api/users/friends`, createSsrConfig(cookie));
  return res.data;
};
const login = async (loginData) => {
  const res = await axiosInstance.post("/api/auth/login", loginData);
  return res.data;
};
const signup = async (signupData) => {
  const res = await axiosInstance.post("/api/auth/signup", signupData);
  return res.data;
};
const verifyEmail = async (code) => {
  const res = await axiosInstance.post("/api/auth/verify-email", code);
  return res.data;
};
const resendVerificationCode = async () => {
  const res = await axiosInstance.post("/api/auth/resend-code");
  return res.data;
};
const forgotPass = async (email) => {
  const res = await axiosInstance.post("/api/auth/forgot-password", { email });
  return res.data;
};
const resetPassword = async ({ token, password }) => {
  const res = await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });
  return res.data;
};
const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/api/auth/onboarding", userData);
  return response.data;
};
const updateProfile = async (userData) => {
  const response = await axiosInstance.put("/api/auth/update-profile", userData);
  return response.data;
};
const sendFriendRequest = async (id) => {
  const res = await axiosInstance.post(`/api/users/friend-request/${id}`);
  return res.data;
};
const acceptFriendReqs = async (id) => {
  const res = await axiosInstance.put(`/api/users/friend-request/${id}/accept`);
  return res.data;
};
const logout = async () => {
  const res = await axiosInstance.post("/api/auth/logout", {}, { withCredentials: true });
  return res.data;
};
const useSignUp = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/verify-email");
      toast.success("Signup successful! Please verify your email.");
    },
    onError: () => {
      toast.error(error.response.data.message);
    }
  });
  return { mutate, isPending };
};
const useAuthUser = () => {
  var _a;
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false
  });
  return { isLoading: authUser.isLoading, authUser: (_a = authUser.data) == null ? void 0 : _a.user };
};
const BASE_URL = "http://localhost:5000";
const useSocketStore = create((set, get) => ({
  onlineUsers: [],
  socket: null,
  connectSocket: (authUser) => {
    var _a;
    if (!authUser || ((_a = get().socket) == null ? void 0 : _a.connected)) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id
      }
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket == null ? void 0 : socket.connected) {
      socket.disconnect();
      set({ socket: null, onlineUsers: [] });
    }
  }
}));
const png = "/assets/signup-DVHsZNDk.png";
const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: "",
    email: "",
    password: ""
  });
  const { mutate, isPending } = useSignUp();
  const { authUser } = useAuthUser();
  const { connectSocket } = useSocketStore();
  const handleSignup = (e) => {
    e.preventDefault();
    mutate(signupData);
  };
  useEffect(() => {
    if (authUser == null ? void 0 : authUser._id) {
      connectSocket(authUser);
    }
  }, [authUser == null ? void 0 : authUser._id]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "h-screen xs:h-full flex items-center justify-center p-4 sm:p-6 md:p-8",
      "data-theme": "forest",
      children: /* @__PURE__ */ jsxs("div", { className: "border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 p-4 sm:p-8 flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-start gap-2", children: [
            /* @__PURE__ */ jsx(EarthIcon, { className: "size-9 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-t from-primary to-secondary tracking-wider", children: "SocialTalk" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSignup, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Create an account" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70", children: "Join SocialTalk and start your language learning advanture!" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "w-full form-control", children: [
                /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Full Name" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    placeholder: "sachin kumar",
                    className: "input input-bordered w-full",
                    value: signupData.fullName,
                    onChange: (e) => setSignupData({
                      ...signupData,
                      fullName: e.target.value
                    })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full form-control", children: [
                /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Email" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    placeholder: "sachin@gmail.com",
                    className: "input input-bordered w-full",
                    value: signupData.email,
                    onChange: (e) => setSignupData({ ...signupData, email: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full form-control", children: [
                /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Password" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    placeholder: "password",
                    className: "input input-bordered w-full",
                    value: signupData.password,
                    onChange: (e) => setSignupData({
                      ...signupData,
                      password: e.target.value
                    })
                  }
                ),
                /* @__PURE__ */ jsx("p", { className: "text-xs opacity-70 mt-1", children: "Password must be at least 6 characters long" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "form-control", children: /* @__PURE__ */ jsxs("label", { className: "label cursor-pointer justify-start gap-2", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    className: "checkbox checkbox-sm",
                    required: true
                  }
                ),
                /* @__PURE__ */ jsxs("span", { className: "text-xs leading-tight", children: [
                  "I agree to the",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-primary hover:underline", children: "terms of service" }),
                  " ",
                  "and",
                  " ",
                  /* @__PURE__ */ jsx("span", { className: "text-primary hover:underline", children: "privacy policy" })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-primary w-full", type: "submit", children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-xs" }),
              "Signing up..."
            ] }) : "Create Account" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
              "Already have an Account?",
              " ",
              /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-primary hover:underline", children: "Sign in" })
            ] }) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "relative aspect-square max-w-sm mx-auto", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: png,
              alt: "Language connection illustration",
              className: "w-full h-full"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 mt-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Connect with language partners worldwide" }),
            /* @__PURE__ */ jsx("p", { className: "opacity-70", children: "Practice conversations, make friends, and improve your language skills together" })
          ] })
        ] }) })
      ] })
    }
  );
};
const useLogIn = () => {
  const queryClient = useQueryClient();
  const { connectSocket } = useSocketStore();
  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      const data = await queryClient.fetchQuery({
        queryKey: ["authUser"]
      });
      connectSocket(data.user);
      toast.success("Login successful.");
    },
    onError: (error2) => {
      toast.error(error2.response.data.message);
    }
  });
  return { mutate, isPending };
};
const LogInPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const { mutate, isPending } = useLogIn();
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(loginData);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "h-screen xs:h-full flex items-center justify-center p-4 sm:p-6 md:p-8",
      "data-theme": "forest",
      children: /* @__PURE__ */ jsxs("div", { className: "border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 p-4 sm:p-8 flex flex-col", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-start gap-2", children: [
            /* @__PURE__ */ jsx(EarthIcon, { className: "size-9 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-t from-primary to-secondary tracking-wider", children: "SocialTalk" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-full", children: /* @__PURE__ */ jsx("form", { onSubmit: handleSubmit, children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Welcome Back" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70", children: "Sign in to your account to continue your language journey" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "w-full form-control", children: [
                /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Email" }) }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    placeholder: "sachin@gmail.com",
                    className: "input input-bordered w-full",
                    value: loginData.email,
                    onChange: (e) => setLoginData({ ...loginData, email: e.target.value })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "w-full form-control", children: [
                /* @__PURE__ */ jsxs("label", { className: "label flex justify-between", children: [
                  /* @__PURE__ */ jsx("span", { className: "label-text", children: "Password" }),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/forgot-password",
                      className: "text-xs text-primary hover:underline",
                      children: "Forgot password?"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "password",
                    placeholder: "password",
                    className: "input input-bordered w-full",
                    value: loginData.password,
                    onChange: (e) => setLoginData({ ...loginData, password: e.target.value })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-primary w-full", type: "submit", children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-xs" }),
              "Signing in..."
            ] }) : "Sign in" }),
            /* @__PURE__ */ jsx("div", { className: "mt-4 text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm", children: [
              "Don't have an account?",
              " ",
              /* @__PURE__ */ jsx(Link, { to: "/signup", className: "text-primary hover:underline", children: "Sign up" })
            ] }) })
          ] }) }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "relative aspect-square max-w-sm mx-auto", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: png,
              alt: "Language connection illustration",
              className: "w-full h-full"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 mt-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Connect with language partners worldwide" }),
            /* @__PURE__ */ jsx("p", { className: "opacity-70", children: "Practice conversations, make friends, and improve your language skills together" })
          ] })
        ] }) })
      ] })
    }
  );
};
const THEMES = [
  {
    name: "light",
    label: "Light",
    colors: ["#ffffff", "#5a67d8", "#8b5cf6", "#1a202c"]
  },
  {
    name: "dark",
    label: "Dark",
    colors: ["#1f2937", "#8b5cf6", "#ec4899", "#1a202c"]
  },
  {
    name: "cupcake",
    label: "Cupcake",
    colors: ["#f5f5f4", "#65c3c8", "#ef9fbc", "#291334"]
  },
  {
    name: "forest",
    label: "Forest",
    colors: ["#1f1d1d", "#3ebc96", "#70c217", "#e2e8f0"]
  },
  {
    name: "bumblebee",
    label: "Bumblebee",
    colors: ["#ffffff", "#f8e36f", "#f0d50c", "#1c1917"]
  },
  {
    name: "emerald",
    label: "Emerald",
    colors: ["#ffffff", "#66cc8a", "#3b82f6", "#1e3a8a"]
  },
  {
    name: "corporate",
    label: "Corporate",
    colors: ["#ffffff", "#4b6bfb", "#7b92b2", "#1d232a"]
  },
  {
    name: "synthwave",
    label: "Synthwave",
    colors: ["#2d1b69", "#e779c1", "#58c7f3", "#f8f8f2"]
  },
  {
    name: "retro",
    label: "Retro",
    colors: ["#e4d8b4", "#ea6962", "#6aaa64", "#282425"]
  },
  {
    name: "cyberpunk",
    label: "Cyberpunk",
    colors: ["#ffee00", "#ff7598", "#75d1f0", "#1a103d"]
  },
  {
    name: "valentine",
    label: "Valentine",
    colors: ["#f0d6e8", "#e96d7b", "#a991f7", "#37243c"]
  },
  {
    name: "halloween",
    label: "Halloween",
    colors: ["#0d0d0d", "#ff7800", "#006400", "#ffffff"]
  },
  {
    name: "garden",
    label: "Garden",
    colors: ["#e9e7e7", "#ec4899", "#16a34a", "#374151"]
  },
  {
    name: "aqua",
    label: "Aqua",
    colors: ["#193549", "#4cd4e3", "#9059ff", "#f8d766"]
  },
  {
    name: "lofi",
    label: "Lofi",
    colors: ["#0f0f0f", "#1a1919", "#232323", "#2c2c2c"]
  },
  {
    name: "pastel",
    label: "Pastel",
    colors: ["#f7f3f5", "#d1c1d7", "#a1e3d8", "#4a98f1"]
  },
  {
    name: "fantasy",
    label: "Fantasy",
    colors: ["#ffe7d6", "#a21caf", "#3b82f6", "#f59e0b"]
  },
  {
    name: "wireframe",
    label: "Wireframe",
    colors: ["#e6e6e6", "#b3b3b3", "#b3b3b3", "#888888"]
  },
  {
    name: "black",
    label: "Black",
    colors: ["#000000", "#191919", "#313131", "#4a4a4a"]
  },
  {
    name: "luxury",
    label: "Luxury",
    colors: ["#171618", "#1e293b", "#94589c", "#d4a85a"]
  },
  {
    name: "dracula",
    label: "Dracula",
    colors: ["#282a36", "#ff79c6", "#bd93f9", "#f8f8f2"]
  },
  {
    name: "cmyk",
    label: "CMYK",
    colors: ["#f0f0f0", "#0891b2", "#ec4899", "#facc15"]
  },
  {
    name: "autumn",
    label: "Autumn",
    colors: ["#f2f2f2", "#8c1f11", "#f28c18", "#6f4930"]
  },
  {
    name: "business",
    label: "Business",
    colors: ["#f5f5f5", "#1e40af", "#3b82f6", "#f97316"]
  },
  {
    name: "acid",
    label: "Acid",
    colors: ["#110e0e", "#ff00f2", "#ff7a00", "#99ff01"]
  },
  {
    name: "lemonade",
    label: "Lemonade",
    colors: ["#ffffff", "#67e8f9", "#f5d742", "#2c3333"]
  },
  {
    name: "night",
    label: "Night",
    colors: ["#0f172a", "#38bdf8", "#818cf8", "#e2e8f0"]
  },
  {
    name: "coffee",
    label: "Coffee",
    colors: ["#20161f", "#dd9866", "#497174", "#eeeeee"]
  },
  {
    name: "winter",
    label: "Winter",
    colors: ["#ffffff", "#0284c7", "#d946ef", "#0f172a"]
  },
  {
    name: "dim",
    label: "Dim",
    colors: ["#1c1c27", "#10b981", "#ff5a5f", "#0f172a"]
  },
  {
    name: "nord",
    label: "Nord",
    colors: ["#eceff4", "#5e81ac", "#81a1c1", "#3b4252"]
  },
  {
    name: "sunset",
    label: "Sunset",
    colors: ["#1e293b", "#f5734c", "#ec4899", "#ffffff"]
  }
];
const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin",
  "Japanese",
  "Korean",
  "Hindi",
  "Russian",
  "Portuguese",
  "Arabic",
  "Italian",
  "Turkish",
  "Dutch"
];
const LANGUAGE_TO_FLAG = {
  english: "gb",
  spanish: "es",
  french: "fr",
  german: "de",
  mandarin: "cn",
  japanese: "jp",
  korean: "kr",
  hindi: "in",
  russian: "ru",
  portuguese: "pt",
  arabic: "sa",
  italian: "it",
  turkish: "tr",
  dutch: "nl"
};
const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: (authUser == null ? void 0 : authUser.fullName) || "",
    bio: (authUser == null ? void 0 : authUser.bio) || "",
    profilePic: (authUser == null ? void 0 : authUser.profilePic) || "",
    nativeLanguage: (authUser == null ? void 0 : authUser.nativeLanguage) || "",
    learningLanguage: (authUser == null ? void 0 : authUser.learningLanguage) || "",
    location: (authUser == null ? void 0 : authUser.location) || ""
  });
  const { mutate, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err2) => {
      toast.error(err2.response.data.message);
    }
  });
  const handlePicture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setFormData({ ...formData, profilePic: reader.result });
      };
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(formData);
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-base-100 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "card bg-base-200 w-full max-w-3xl shadow-xl", children: /* @__PURE__ */ jsxs("div", { className: "card-body p-6 sm:p-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold text-center mb-6", children: "Complete your Profile" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-4", children: [
        /* @__PURE__ */ jsx("div", { className: "size-32 rounded-full bg-base-300 overflow-hidden", children: formData.profilePic ? /* @__PURE__ */ jsx(
          "img",
          {
            src: formData.profilePic,
            alt: "Profile Preview",
            className: "w-full h-full object-cover"
          }
        ) : /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx(CameraIcon, { className: "size-12 text-base-content opacity-40" }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxs(
            "label",
            {
              className: "btn btn-accent cursor-pointer",
              htmlFor: "fileInput",
              children: [
                /* @__PURE__ */ jsx(CameraIcon, { className: "size-4 mr-2" }),
                "Choose Profile Picture"
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              id: "fileInput",
              type: "file",
              accept: "image/*",
              onChange: handlePicture,
              className: "hidden"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Full Name" }) }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            name: "fullName",
            value: formData.fullName,
            onChange: (e) => setFormData({ ...formData, fullName: e.target.value }),
            className: "input input-bordered w-full",
            placeholder: "Your full name"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Bio" }) }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            name: "bio",
            value: formData.bio,
            onChange: (e) => setFormData({ ...formData, bio: e.target.value }),
            className: "textarea textarea-bordered h-24",
            placeholder: "Tell others about yourself and your language learning goals"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Native Language" }) }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "nativeLanguage",
              value: formData.nativeLanguage,
              onChange: (e) => setFormData({ ...formData, nativeLanguage: e.target.value }),
              className: "select select-bordered w-full",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select your native language" }),
                LANGUAGES.map((lang) => /* @__PURE__ */ jsx("option", { value: lang.toLowerCase(), children: lang }, `native-${lang}`))
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
          /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Learning Language" }) }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              name: "learningLanguage",
              value: formData.learningLanguage,
              onChange: (e) => setFormData({
                ...formData,
                learningLanguage: e.target.value
              }),
              className: "select select-bordered w-full",
              children: [
                /* @__PURE__ */ jsx("option", { value: "", children: "Select your learning language" }),
                LANGUAGES.map((lang) => /* @__PURE__ */ jsx("option", { value: lang.toLowerCase(), children: lang }, `native-${lang}`))
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "form-control", children: [
        /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "Location" }) }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(MapPinIcon, { className: "absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              name: "location",
              value: formData.location,
              onChange: (e) => setFormData({ ...formData, location: e.target.value }),
              className: "input input-bordered w-full pl-10",
              placeholder: "City, Country"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { className: "btn btn-primary w-full", disabled: isPending, children: !isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(EarthIcon, { className: "size-5 mr-2" }),
        "Complete Onboarding"
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(LoaderIcon, { className: "size-5 mr-2 animate-spin" }),
        "Onboarding..."
      ] }) })
    ] })
  ] }) }) });
};
const useThemeStore = create((set) => ({
  theme: typeof window !== "undefined" ? localStorage.getItem("app-theme") || "night" : "night",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-theme", theme);
    }
    set({ theme });
  }
}));
const PageLoader = () => {
  const { theme } = useThemeStore();
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-base-100/30 backdrop-blur-md",
      "data-theme": theme,
      children: /* @__PURE__ */ jsx(Disc3Icon, { className: "animate-spin size-10 text-primary" })
    }
  );
};
const useVerifyEmail = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: verifyEmail,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/onboarding");
      toast.success("verification successful");
    },
    onError: (error2) => {
      var _a, _b;
      toast.error(((_b = (_a = error2 == null ? void 0 : error2.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Verification failed");
    }
  });
  return { mutate, isPending };
};
const useResendCode = () => {
  return useMutation({
    mutationFn: resendVerificationCode,
    onSuccess: () => toast.success("Code resent to your email"),
    onError: (err2) => {
      var _a, _b;
      return toast.error(((_b = (_a = err2 == null ? void 0 : err2.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Failed to resend code");
    }
  });
};
const EmailVerification = () => {
  const [code, setcode] = useState({
    code: ""
  });
  const { mutate, isPending } = useVerifyEmail();
  const { mutate: resendCode, isPending: isResending } = useResendCode();
  const handleSubmit = (e) => {
    e.preventDefault();
    mutate(code);
  };
  const handleResend = () => {
    resendCode();
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "h-screen flex items-center justify-center p-4 sm:p-6 md:p-8",
      "data-theme": "forest",
      children: /* @__PURE__ */ jsxs("div", { className: "border border-primary/25 flex flex-col lg:flex-row w-full max-w-4xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "w-full lg:w-1/2 p-6 flex flex-col justify-center", children: [
          /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-start gap-2", children: [
            /* @__PURE__ */ jsx(EarthIcon, { className: "size-9 text-primary" }),
            /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-t from-primary to-secondary tracking-wider", children: "SocialTalk" })
          ] }),
          /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-5 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Verify your email" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 mt-1", children: "Enter the 6-digit code sent to your email." })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "w-full form-control", children: [
              /* @__PURE__ */ jsx("label", { className: "label", children: /* @__PURE__ */ jsx("span", { className: "label-text", children: "6-digit code" }) }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  maxLength: "6",
                  placeholder: "123456",
                  className: "input input-bordered text-center tracking-widest text-lg",
                  value: code.code,
                  onChange: (e) => setcode({ code: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("button", { className: "btn btn-primary w-full", type: "submit", children: isPending || isResending ? /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-xs" }),
              "verifying..."
            ] }) : "Verify Email" }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-center mt-2", children: [
              "Didn’t receive the code?",
              " ",
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: handleResend,
                  className: "text-primary hover:underline",
                  children: "Resend Code"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md p-8", children: [
          /* @__PURE__ */ jsx("div", { className: "relative aspect-square max-w-sm mx-auto", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: "/verify.svg",
              alt: "Verify Email",
              className: "w-full h-full"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "text-center space-y-3 mt-6", children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold", children: "Secure your account" }),
            /* @__PURE__ */ jsx("p", { className: "opacity-70", children: "We’ve sent a verification code to your email. Enter it to complete your signup." })
          ] })
        ] }) })
      ] })
    }
  );
};
const useForgotPass = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: forgotPass,
    onSuccess: () => {
      toast.success("Reset link sent! Check your email.");
    },
    onError: (error2) => {
      var _a, _b;
      toast.error(((_b = (_a = err == null ? void 0 : err.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || "Something went wrong");
    }
  });
  return { mutate, isPending };
};
const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const { mutate, isPending } = useForgotPass();
  const handleSubmit = async (e) => {
    e.preventDefault();
    mutate(email);
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "h-screen flex items-center justify-center p-4 sm:p-6 md:p-8",
      "data-theme": "forest",
      children: /* @__PURE__ */ jsxs("div", { className: "border border-primary/25 w-full max-w-md p-8 bg-base-100 rounded-xl shadow-lg", children: [
        /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(EarthIcon, { className: "size-8 text-primary" }),
          /* @__PURE__ */ jsx("span", { className: "text-2xl font-bold font-mono text-primary", children: "SocialTalk" })
        ] }),
        /* @__PURE__ */ jsx("h2", { className: "text-xl font-semibold mb-2", children: "Forgot your password?" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm opacity-70 mb-4", children: "Enter your email and we'll send you a reset link." }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "email",
              placeholder: "your@email.com",
              className: "input input-bordered w-full",
              value: email,
              onChange: (e) => setEmail(e.target.value),
              required: true
            }
          ),
          /* @__PURE__ */ jsx("button", { className: "btn btn-primary w-full", type: "submit", children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-xs" }),
            "Sending..."
          ] }) : "Send Reset Link" })
        ] })
      ] })
    }
  );
};
const useResetPass = () => {
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password Reset successful.");
      navigate("/login");
    },
    onError: (error2) => {
      toast.error(error2.response.data.message);
    }
  });
  return { mutate, isPending };
};
const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate, isPending } = useResetPass();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    mutate({ token, password });
  };
  return /* @__PURE__ */ jsx("div", { className: "h-screen flex items-center justify-center", "data-theme": "forest", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md p-8 bg-base-100 rounded-xl shadow-lg border border-primary/20", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-4 text-center", children: "Reset Your Password" }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          placeholder: "New password",
          className: "input input-bordered w-full",
          value: password,
          onChange: (e) => setPassword(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "password",
          placeholder: "Confirm password",
          className: "input input-bordered w-full",
          value: confirmPassword,
          onChange: (e) => setConfirmPassword(e.target.value),
          required: true
        }
      ),
      /* @__PURE__ */ jsx("button", { className: "btn btn-primary w-full", type: "submit", children: isPending ? /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-xs" }),
        "Resetting..."
      ] }) : "Reset Password" })
    ] })
  ] }) });
};
const useLogOut = () => {
  const queryClient = useQueryClient();
  const { disconnectSocket } = useSocketStore();
  const { mutate } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
      toast.success("Logout successful");
      disconnectSocket();
    }
  });
  return { mutate };
};
const ThemeSelector = () => {
  const { theme, setTheme } = useThemeStore();
  return /* @__PURE__ */ jsxs("div", { className: "dropdown dropdown-end", children: [
    /* @__PURE__ */ jsx("button", { tabIndex: 0, className: "btn btn-ghost btn-circle", children: /* @__PURE__ */ jsx(PaletteIcon, { className: "size-5" }) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        tabIndex: 0,
        className: "dropdown-content mt-2 p-1 shadow-2xl bg-base-200 backdrop-blur-lg rounded-2xl\r\n        w-56 border border-base-content/10 max-h-80 overflow-y-auto",
        children: /* @__PURE__ */ jsx("div", { className: "space-y-1", children: THEMES.map((themeOpt) => /* @__PURE__ */ jsxs(
          "button",
          {
            className: `w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors
                ${theme === themeOpt.name ? "bg-primary/10 text-primary" : "hover:bg-base-content/5"}
            `,
            onClick: () => setTheme(themeOpt.name),
            children: [
              /* @__PURE__ */ jsx(PaletteIcon, { className: "size-4" }),
              /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: themeOpt.label }),
              /* @__PURE__ */ jsx("div", { className: "ml-auto flex gap-1", children: themeOpt.colors.map((color, i) => /* @__PURE__ */ jsx(
                "span",
                {
                  className: "size-2 rounded-full",
                  style: { backgroundColor: color }
                },
                i
              )) })
            ]
          },
          themeOpt.name
        )) })
      }
    )
  ] });
};
const Navbar = () => {
  const { authUser } = useAuthUser();
  const { mutate } = useLogOut();
  return /* @__PURE__ */ jsx("nav", { className: "bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center", children: /* @__PURE__ */ jsx("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxs("div", { className: `flex items-center w-full justify-between`, children: [
    /* @__PURE__ */ jsx("div", { className: "pl-5 xs:pl-0", children: /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5 lg:hidden", children: [
      /* @__PURE__ */ jsx(EarthIcon, { className: "size-9 xs:size-7 text-primary sm:size-5 md:size-7" }),
      /* @__PURE__ */ jsx("span", { className: "text-3xl xs:text-[16px] sm:text-xl md:text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider", children: "SocialTalk" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 sm:gap-4 xs:gap-0", children: [
      /* @__PURE__ */ jsx(Link, { to: "/notifications", children: /* @__PURE__ */ jsx("button", { className: "btn btn-ghost btn-circle", children: /* @__PURE__ */ jsx(BellIcon, { className: "h-6 w-6 xs:w-5 text-base-content opacity-70" }) }) }),
      /* @__PURE__ */ jsx(Link, { to: "/friends", className: "btn btn-ghost btn-circle lg:hidden", children: /* @__PURE__ */ jsx(UsersIcon, { className: "h-6 w-6 xs:w-5 text-base-content opacity-70" }) }),
      /* @__PURE__ */ jsx(ThemeSelector, {}),
      /* @__PURE__ */ jsx(Link, { to: "/update-profile", children: /* @__PURE__ */ jsx("div", { className: "avatar mt-1.5 xs:ml-1.5", children: /* @__PURE__ */ jsx("div", { className: "w-9 xs:w-7 rounded-full", children: /* @__PURE__ */ jsx(
        "img",
        {
          src: authUser == null ? void 0 : authUser.profilePic,
          alt: "User Avatar",
          rel: "noreferrer"
        }
      ) }) }) }),
      /* @__PURE__ */ jsx("button", { className: "btn btn-ghost btn-circle hidden lg:flex", onClick: mutate, children: /* @__PURE__ */ jsx(LogOutIcon, { className: "h-6 w-6 text-base-content opacity-70" }) })
    ] })
  ] }) }) });
};
const Sidebar = () => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  return /* @__PURE__ */ jsxs("aside", { className: "w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0", children: [
    /* @__PURE__ */ jsx("div", { className: "p-[13.5px] border-b border-base-300", children: /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsx(EarthIcon, { className: "size-9 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary  tracking-wider", children: "SocialTalk" })
    ] }) }),
    /* @__PURE__ */ jsxs("nav", { className: "flex-1 p-4 space-y-1", children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: `btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/" ? "btn-active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(HomeIcon, { className: "size-5 text-base-content opacity-70" }),
            /* @__PURE__ */ jsx("span", { children: "Home" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/friends",
          className: `btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/friends" ? "btn-active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(UsersIcon, { className: "size-5 text-base-content opacity-70" }),
            /* @__PURE__ */ jsx("span", { children: "Friends" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/notifications",
          className: `btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${currentPath === "/notifications" ? "btn-active" : ""}`,
          children: [
            /* @__PURE__ */ jsx(BellIcon, { className: "size-5 text-base-content opacity-70" }),
            /* @__PURE__ */ jsx("span", { children: "Notifications" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-base-300 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "avatar", children: /* @__PURE__ */ jsx("div", { className: "w-10 rounded-full", children: /* @__PURE__ */ jsx("img", { src: authUser == null ? void 0 : authUser.profilePic, alt: "User Avatar" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: authUser == null ? void 0 : authUser.fullName }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-success flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success inline-block" }),
          "Online"
        ] })
      ] })
    ] }) })
  ] });
};
const useFriends = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends
  });
  return { friends, loadingFriends };
};
const useChatStore = create((set, get) => ({
  messages: [],
  selectedUser: null,
  isMessageLoading: false,
  getMessages: async (userId) => {
    set({ isMessageLoading: true });
    try {
      const res = await axiosInstance.get(`/api/message/${userId}`);
      set({ messages: res.data });
    } catch (error2) {
      toast.error(error2.response.data.message);
    } finally {
      set({ isMessageLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/api/message/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error2) {
      toast.error(error2.response.data.message);
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useSocketStore.getState().socket;
    socket.off("newMessage");
    socket.on("newMessage", (newMessage) => {
      const senderId = newMessage == null ? void 0 : newMessage.sender;
      const isFromSelectedUser = senderId === selectedUser._id;
      if (!isFromSelectedUser) return;
      set({
        messages: [...get().messages, newMessage]
      });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useSocketStore.getState().socket;
    socket.off("newMessage");
  },
  setSelectedUser: (selectedUser) => set({ selectedUser })
}));
const FriendsSidebar = () => {
  const { authUser } = useAuthUser();
  const { friends, loadingFriends } = useFriends();
  const { onlineUsers } = useSocketStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { selectedUser, setSelectedUser } = useChatStore();
  const friendsWithStatus = friends.map((friend) => ({
    ...friend,
    isOnline: onlineUsers.includes(friend._id)
  }));
  const onlineFriends = friendsWithStatus.filter((f) => f.isOnline);
  const filteredFriends = showOnlineOnly ? friendsWithStatus.filter((f) => f.isOnline) : friendsWithStatus;
  return /* @__PURE__ */ jsxs("aside", { className: "w-64 bg-base-200 border-r border-base-300 hidden lg:flex flex-col h-screen sticky top-0", children: [
    /* @__PURE__ */ jsx("div", { className: "p-[13.5px] border-b border-base-300", children: /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsx(EarthIcon, { className: "size-9 text-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider", children: "SocialTalk" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "ml-6 mt-3 hidden lg:flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("label", { className: "cursor-pointer flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: showOnlineOnly,
            onChange: (e) => setShowOnlineOnly(e.target.checked),
            className: "checkbox checkbox-sm"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Show online only" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500", children: [
        "(",
        onlineFriends.length,
        " online)"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-y-auto w-full py-3 flex-1", children: loadingFriends ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg" }) }) : filteredFriends.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-zinc-500 py-4", children: "No friends to show" }) : filteredFriends.map((friend) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setSelectedUser(friend),
        className: `flex items-center gap-3 px-4 py-2 w-full text-left
                          hover:bg-base-300 transition rounded-lg
                         ${(selectedUser == null ? void 0 : selectedUser._id) === friend._id ? "bg-base-300 ring-1 ring-base-300" : ""}
             `,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: friend.profilePic || "/avatar.png",
                alt: friend.fullName,
                className: "size-10 object-cover rounded-full"
              }
            ),
            friend.isOnline && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "hidden lg:block min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: friend.fullName }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: friend.isOnline ? "Online" : "Offline" })
          ] })
        ]
      },
      friend._id
    )) }),
    /* @__PURE__ */ jsx("div", { className: "p-4 border-t border-base-300 mt-auto", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "avatar", children: /* @__PURE__ */ jsx("div", { className: "w-10 rounded-full", children: /* @__PURE__ */ jsx("img", { src: authUser == null ? void 0 : authUser.profilePic, alt: "User Avatar" }) }) }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold text-sm", children: authUser == null ? void 0 : authUser.fullName }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-success flex items-center gap-1", children: [
          /* @__PURE__ */ jsx("span", { className: "size-2 rounded-full bg-success inline-block" }),
          "Online"
        ] })
      ] })
    ] }) })
  ] });
};
const Footer = () => {
  return /* @__PURE__ */ jsx("footer", { className: "bg-base-200 border-t border-base-300 py-6 mt-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4", children: [
    /* @__PURE__ */ jsxs("p", { className: "text-sm text-zinc-500", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " SocialTalk. All rights reserved."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsx("a", { href: "https://github.com/sachinkumar2222", target: "_blank", rel: "noreferrer", className: "hover:text-primary", children: /* @__PURE__ */ jsx(Github, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://x.com/sparky_sachin", target: "_blank", rel: "noreferrer", className: "hover:text-primary", children: /* @__PURE__ */ jsx(Twitter, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsx("a", { href: "https://www.linkedin.com/in/sparky-sachin-kumar/", className: "hover:text-primary", children: /* @__PURE__ */ jsx(Linkedin, { className: "w-5 h-5" }) })
    ] })
  ] }) });
};
const Layout = ({ children, showSidebar = false }) => {
  const location = useLocation();
  const { authUser } = useAuthUser();
  const { connectSocket } = useSocketStore();
  const isFriendsPage = location.pathname === "/friends";
  useEffect(() => {
    if (authUser) {
      connectSocket(authUser);
    }
  }, [authUser]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-base-100", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
    showSidebar && (isFriendsPage ? /* @__PURE__ */ jsx(FriendsSidebar, {}) : /* @__PURE__ */ jsx(Sidebar, {})),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-1 flex-col", children: [
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx("main", { className: "flex-1 overflow-y-auto", children }),
      isFriendsPage ? "" : /* @__PURE__ */ jsx(Footer, {})
    ] })
  ] }) });
};
const NoUserFound = () => {
  return /* @__PURE__ */ jsxs("div", { className: "card bg-base-200 p-6 text-center", children: [
    /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg mb-2", children: "No recommendations available" }),
    /* @__PURE__ */ jsx("p", { className: "text-base-content opacity-70", children: "Check back later for new language partners!" })
  ] });
};
const capitialize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
function getLanguageFlag(language) {
  if (!language) return null;
  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];
  if (countryCode) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: `https://flagcdn.com/24x18/${countryCode}.png`,
        alt: `${langLower} flag`,
        className: "h-3 mr-1 inline-block"
      }
    );
  }
  return null;
}
function formatMessageTime(date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
}
const RecommandUser = ({
  recommendedUsers,
  outgoingRequestsIds,
  mutate,
  isPending
}) => {
  return /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: recommendedUsers.map((user) => {
    const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: "rounded-2xl bg-base-200 border border-base-300 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
        children: /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-5", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "size-16 rounded-full overflow-hidden border border-base-300 shadow-sm", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: user.profilePic,
                alt: user.fullName,
                className: "w-full h-full object-cover"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg text-base-content", children: user.fullName }),
              user.location && /* @__PURE__ */ jsxs("div", { className: "flex items-center text-xs text-base-content/70 mt-1", children: [
                /* @__PURE__ */ jsx(MapPinIcon, { className: "size-3 mr-1" }),
                user.location
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 text-xs", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-md bg-secondary text-secondary-content font-medium", children: [
              getLanguageFlag(user.nativeLanguage),
              "Native: ",
              capitialize(user.nativeLanguage)
            ] }),
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 px-2 py-1 rounded-md border border-base-300 text-base-content/80 bg-base-100", children: [
              getLanguageFlag(user.learningLanguage),
              "Learning: ",
              capitialize(user.learningLanguage)
            ] })
          ] }),
          user.bio && /* @__PURE__ */ jsx("p", { className: "text-sm text-base-content/80 leading-relaxed line-clamp-3", children: user.bio }),
          /* @__PURE__ */ jsx(
            "button",
            {
              className: `btn w-full mt-1 ${hasRequestBeenSent ? "btn-disabled bg-base-300 text-base-content/60" : "btn-primary"}`,
              onClick: () => mutate(user._id),
              disabled: hasRequestBeenSent || isPending,
              children: hasRequestBeenSent ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(CheckCircleIcon, { className: "size-4 mr-2" }),
                "Request Sent"
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(UserPlusIcon, { className: "size-4 mr-2" }),
                "Send Friend Request"
              ] })
            }
          )
        ] })
      },
      user._id
    );
  }) });
};
const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(/* @__PURE__ */ new Set());
  const { data: recommUser = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["user"],
    queryFn: getRecommUser
  });
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs
  });
  const { mutate, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: async (userId) => {
      setOutgoingRequestsIds((prev) => new Set(prev).add(userId));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] })
  });
  useEffect(() => {
    if (!Array.isArray(outgoingFriendReqs)) return;
    const ids = new Set(outgoingFriendReqs.map((req) => req.receiver._id));
    setOutgoingRequestsIds(ids);
  }, [outgoingFriendReqs]);
  return /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 lg:p-8", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto space-y-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: "Your Friends" }),
      /* @__PURE__ */ jsxs(Link, { to: "/notifications", className: "btn btn-outline btn-sm", children: [
        /* @__PURE__ */ jsx(UsersIcon, { className: "mr-2 size-4" }),
        "Friend Requests"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("section", { children: [
      /* @__PURE__ */ jsx("div", { className: "mb-6 sm:mb-8", children: /* @__PURE__ */ jsx("div", { className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4", children: /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl sm:text-3xl font-bold tracking-tight", children: "Meet New Learners" }),
        /* @__PURE__ */ jsx("p", { className: "opacity-70", children: "Discover perfect language exchange partners based on your profile" })
      ] }) }) }),
      loadingUsers ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg" }) }) : recommUser.length === 0 ? /* @__PURE__ */ jsx(NoUserFound, {}) : /* @__PURE__ */ jsx(
        RecommandUser,
        {
          recommendedUsers: recommUser,
          outgoingRequestsIds,
          mutate,
          isPending
        }
      )
    ] })
  ] }) });
};
function NoNotificationsFound() {
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "size-16 rounded-full bg-base-300 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx(BellIcon, { className: "size-8 text-base-content opacity-40" }) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg font-semibold mb-2", children: "No notifications yet" }),
    /* @__PURE__ */ jsx("p", { className: "text-base-content opacity-70 max-w-md", children: "When you receive friend requests or messages, they'll appear here." })
  ] });
}
const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendReqs
  });
  const { mutate, isPending } = useMutation({
    mutationFn: acceptFriendReqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    }
  });
  const incomingRequests = (friendRequests == null ? void 0 : friendRequests.incomingReqs) || [];
  const acceptedRequests = (friendRequests == null ? void 0 : friendRequests.acceptedReqs) || [];
  return /* @__PURE__ */ jsx("div", { className: "p-4 sm:p-6 lg:p-8 xs:h-[100vh]", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto max-w-4xl space-y-8", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl sm:text-3xl font-bold tracking-tight mb-6", children: "Notifications" }),
    isLoading ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg" }) }) : /* @__PURE__ */ jsx(AnimatePresence, { children: incomingRequests.length > 0 || acceptedRequests.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      incomingRequests.length > 0 && /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(UserCheckIcon, { className: "h-5 w-5 text-primary" }),
          "Friend Requests",
          /* @__PURE__ */ jsx("span", { className: "badge badge-primary ml-2", children: incomingRequests.length })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: incomingRequests.map((req) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2 },
            className: "card bg-base-200 shadow-sm hover:shadow-md transition-shadow",
            children: /* @__PURE__ */ jsx("div", { className: "card-body p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsx("div", { className: "avatar w-14 h-14 rounded-full bg-base-300 overflow-hidden", children: /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: req.sender.profilePic,
                    alt: req.sender.fullName,
                    className: "object-cover w-full h-full"
                  }
                ) }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: req.sender.fullName }),
                  /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-1.5 mt-1 text-sm", children: [
                    /* @__PURE__ */ jsxs("span", { className: "badge badge-secondary badge-sm", children: [
                      "Native: ",
                      req.sender.nativeLanguage
                    ] }),
                    /* @__PURE__ */ jsxs("span", { className: "badge badge-outline badge-sm", children: [
                      "Learning: ",
                      req.sender.learningLanguage
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  className: "btn btn-primary btn-sm",
                  onClick: () => mutate(req._id),
                  disabled: isPending,
                  children: isPending ? "Accepting..." : "Accept"
                }
              )
            ] }) })
          },
          req._id
        )) })
      ] }),
      acceptedRequests.length > 0 && /* @__PURE__ */ jsxs("section", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("h2", { className: "text-xl font-semibold flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(BellIcon, { className: "h-5 w-5 text-success" }),
          "New Connections"
        ] }),
        /* @__PURE__ */ jsx("div", { className: "space-y-3", children: acceptedRequests.map((noti) => /* @__PURE__ */ jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            transition: { duration: 0.2 },
            className: "card bg-base-200 shadow-sm",
            children: /* @__PURE__ */ jsx("div", { className: "card-body p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "avatar mt-1 size-10 rounded-full overflow-hidden bg-base-300", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: noti.receiver.profilePic,
                  alt: noti.receiver.fullName,
                  className: "object-cover w-full h-full"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: noti.receiver.fullName }),
                /* @__PURE__ */ jsxs("p", { className: "text-sm mt-0.5", children: [
                  noti.receiver.fullName,
                  " accepted your friend request"
                ] }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs flex items-center text-gray-500 mt-1", children: [
                  /* @__PURE__ */ jsx(ClockIcon, { className: "h-3 w-3 mr-1" }),
                  "Recently"
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "badge badge-success text-xs", children: [
                /* @__PURE__ */ jsx(MessageSquareIcon, { className: "h-3 w-3 mr-1" }),
                "New Friend"
              ] })
            ] }) })
          },
          noti._id
        )) })
      ] })
    ] }) : /* @__PURE__ */ jsx(NoNotificationsFound, {}) })
  ] }) });
};
const NoChatSelected = () => {
  return /* @__PURE__ */ jsx("div", { className: "w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center space-y-6", children: [
    /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-4 mb-4", children: /* @__PURE__ */ jsx("div", { className: "relative", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "w-16 h-16 rounded-2xl bg-primary/10 flex items-center\r\n             justify-center animate-bounce",
        children: /* @__PURE__ */ jsx(MessageSquare, { className: "w-8 h-8 text-primary " })
      }
    ) }) }),
    /* @__PURE__ */ jsx("h2", { className: "text-2xl font-bold", children: "Welcome to SocialTalk!" }),
    /* @__PURE__ */ jsx("p", { className: "text-base-content/60", children: "Select a conversation from the sidebar to start chatting" })
  ] }) });
};
const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useSocketStore();
  return /* @__PURE__ */ jsx("div", { className: "p-2.5 border-b border-base-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("div", { className: "avatar", children: /* @__PURE__ */ jsx("div", { className: "size-10 rounded-full relative", children: /* @__PURE__ */ jsx("img", { src: selectedUser.profilePic || "/avatar.png", alt: selectedUser.fullName }) }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "font-medium", children: selectedUser.fullName }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-base-content/70", children: onlineUsers.includes(selectedUser._id) ? "Online" : "Offline" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("button", { onClick: () => setSelectedUser(null), children: /* @__PURE__ */ jsx(X, {}) })
  ] }) });
};
const ChatInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview
      });
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error2) {
      console.error("Failed to send message:", error2);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4 w-full", children: [
    imagePreview && /* @__PURE__ */ jsx("div", { className: "mb-3 flex items-center gap-2", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: imagePreview,
          alt: "Preview",
          className: "w-20 h-20 object-cover rounded-lg border border-zinc-700"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: removeImage,
          className: "absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300\r\n              flex items-center justify-center",
          type: "button",
          children: /* @__PURE__ */ jsx(X, { className: "size-3" })
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSendMessage, className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex-1 flex gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "text",
            className: "w-full input input-bordered rounded-lg input-sm sm:input-md",
            placeholder: "Type a message...",
            value: text,
            onChange: (e) => setText(e.target.value)
          }
        ),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "file",
            accept: "image/*",
            className: "hidden",
            ref: fileInputRef,
            onChange: handleImageChange
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: `hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`,
            onClick: () => {
              var _a;
              return (_a = fileInputRef.current) == null ? void 0 : _a.click();
            },
            children: /* @__PURE__ */ jsx(Image, { size: 20 })
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "submit",
          className: "btn btn-sm btn-circle",
          disabled: !text.trim() && !imagePreview,
          children: /* @__PURE__ */ jsx(Send, { size: 22 })
        }
      )
    ] })
  ] });
};
const MessageSkeleton = () => {
  const skeletonMessages = Array(6).fill(null);
  return /* @__PURE__ */ jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: skeletonMessages.map((_, idx) => /* @__PURE__ */ jsxs("div", { className: `chat ${idx % 2 === 0 ? "chat-start" : "chat-end"}`, children: [
    /* @__PURE__ */ jsx("div", { className: "chat-image avatar", children: /* @__PURE__ */ jsx("div", { className: "size-10 rounded-full", children: /* @__PURE__ */ jsx("div", { className: "skeleton w-full h-full rounded-full" }) }) }),
    /* @__PURE__ */ jsx("div", { className: "chat-header mb-1", children: /* @__PURE__ */ jsx("div", { className: "skeleton h-4 w-16" }) }),
    /* @__PURE__ */ jsx("div", { className: "chat-bubble bg-transparent p-0", children: /* @__PURE__ */ jsx("div", { className: "skeleton h-16 w-[200px]" }) })
  ] }, idx)) });
};
const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages
  } = useChatStore();
  const { authUser } = useAuthUser();
  const messageEndRef = useRef(null);
  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (isMessagesLoading) {
    return /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col overflow-auto", children: [
      /* @__PURE__ */ jsx(ChatHeader, {}),
      /* @__PURE__ */ jsx(MessageSkeleton, {}),
      /* @__PURE__ */ jsx(ChatInput, {})
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "relative h-full w-full flex flex-col", children: [
    /* @__PURE__ */ jsx("div", { className: "sticky top-0 z-10 bg-base-100 border-b border-base-300", children: /* @__PURE__ */ jsx(ChatHeader, {}) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar",
        style: { scrollbarWidth: "none" },
        children: messages.map((message) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: `chat ${message.sender === authUser._id ? "chat-end" : "chat-start"}`,
            ref: messageEndRef,
            children: [
              /* @__PURE__ */ jsx("div", { className: "chat-image avatar", children: /* @__PURE__ */ jsx("div", { className: "size-10 rounded-full border", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: message.sender === authUser._id ? authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png",
                  alt: "profile"
                }
              ) }) }),
              /* @__PURE__ */ jsx("div", { className: "chat-header mb-1", children: /* @__PURE__ */ jsx("time", { className: "text-xs opacity-50 ml-1", children: formatMessageTime(message.createdAt) }) }),
              /* @__PURE__ */ jsxs("div", { className: "chat-bubble flex flex-col", children: [
                message.image && /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: message.image,
                    alt: "Attachment",
                    className: "sm:max-w-[200px] rounded-md mb-2"
                  }
                ),
                message.text && /* @__PURE__ */ jsx("p", { children: message.text })
              ] })
            ]
          },
          message._id
        ))
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "sticky bottom-0 z-10 bg-base-100 border-t border-base-300", children: /* @__PURE__ */ jsx(ChatInput, {}) })
  ] });
};
const FriendsList = () => {
  const { friends, loadingFriends } = useFriends();
  const { onlineUsers } = useSocketStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const { selectedUser, setSelectedUser } = useChatStore();
  const friendsWithStatus = friends.map((friend) => ({
    ...friend,
    isOnline: onlineUsers.includes(friend._id)
  }));
  const onlineFriends = friendsWithStatus.filter((f) => f.isOnline);
  const filteredFriends = showOnlineOnly ? friendsWithStatus.filter((f) => f.isOnline) : friendsWithStatus;
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "ml-6 mt-3 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("label", { className: "cursor-pointer flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "checkbox",
            checked: showOnlineOnly,
            onChange: (e) => setShowOnlineOnly(e.target.checked),
            className: "checkbox checkbox-sm"
          }
        ),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Show online only" })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "text-xs text-zinc-500", children: [
        "(",
        onlineFriends.length,
        " online)"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "overflow-y-auto w-full py-3 flex-1", children: loadingFriends ? /* @__PURE__ */ jsx("div", { className: "flex justify-center py-12", children: /* @__PURE__ */ jsx("span", { className: "loading loading-spinner loading-lg" }) }) : filteredFriends.length === 0 ? /* @__PURE__ */ jsx("div", { className: "text-center text-zinc-500 py-4", children: "No friends to show" }) : filteredFriends.map((friend) => /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setSelectedUser(friend),
        className: `flex items-center gap-3 px-4 py-2 w-full text-left
                          hover:bg-base-300 transition rounded-lg
                          ${(selectedUser == null ? void 0 : selectedUser._id) === friend._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: friend.profilePic || "/avatar.png",
                alt: friend.fullName,
                className: "size-10 object-cover rounded-full"
              }
            ),
            friend.isOnline && /* @__PURE__ */ jsx("span", { className: "absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: " lg:block min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: friend.fullName }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: friend.isOnline ? "Online" : "Offline" })
          ] })
        ]
      },
      friend._id
    )) })
  ] });
};
const FriendsPage = () => {
  const { selectedUser } = useChatStore();
  return /* @__PURE__ */ jsx("div", { className: "bg-base-200", children: /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-4rem)] sm:h-[calc(100vh - 6vh)]", children: /* @__PURE__ */ jsxs("div", { className: "flex h-full rounded-lg overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "hidden lg:flex w-full h-full", children: !selectedUser ? /* @__PURE__ */ jsx(NoChatSelected, {}) : /* @__PURE__ */ jsx(ChatContainer, {}) }),
    /* @__PURE__ */ jsx("div", { className: "block lg:hidden w-full h-full", children: selectedUser ? /* @__PURE__ */ jsx(ChatContainer, {}) : /* @__PURE__ */ jsx(FriendsList, {}) })
  ] }) }) }) });
};
const UpdateProfilePage = () => {
  var _a;
  const [selectedImg, setSelectedImg] = useState(null);
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout2 } = useLogOut();
  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (err2) => {
      var _a2, _b;
      toast.error(((_b = (_a2 = err2.response) == null ? void 0 : _a2.data) == null ? void 0 : _b.message) || "Something went wrong");
    }
  });
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      mutate({ profilePic: base64Image });
    };
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-base-100", children: [
    /* @__PURE__ */ jsxs("div", { className: "h-16 flex items-center px-2 sticky top-0 z-10 bg-base-100 border-b border-base-300", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => navigate("/"),
          className: "btn btn-ghost flex items-center gap-2 text-sm",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5" }),
            /* @__PURE__ */ jsx("span", { children: "Back" })
          ]
        }
      ),
      /* @__PURE__ */ jsx("h1", { className: "ml-4 text-lg font-semibold", children: "Update Profile" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "pt-20 xs:pt-10 px-4", children: /* @__PURE__ */ jsx("div", { className: "max-w-2xl mx-auto space-y-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-base-300 rounded-2xl shadow p-8 space-y-10", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold", children: "Your Profile" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-zinc-500", children: "Manage your profile details" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: selectedImg || authUser.profilePic || "/avatar.png",
              alt: "Profile",
              className: "size-32 rounded-full object-cover border-4 border-base-200"
            }
          ),
          /* @__PURE__ */ jsxs(
            "label",
            {
              htmlFor: "avatar-upload",
              className: `absolute bottom-0 right-0 bg-base-content hover:scale-105
                p-2 rounded-full cursor-pointer transition-transform duration-200 
                ${isPending ? "animate-pulse pointer-events-none opacity-50" : ""}`,
              children: [
                /* @__PURE__ */ jsx(Camera, { className: "w-5 h-5 text-base-200" }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "file",
                    id: "avatar-upload",
                    className: "hidden",
                    accept: "image/*",
                    onChange: handleImageUpload,
                    disabled: isPending
                  }
                )
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-zinc-400", children: isPending ? "Uploading..." : "Click camera icon to change photo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "text-sm text-zinc-500 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
            "Full Name"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "px-4 py-2 mt-1 bg-base-200 rounded-lg border border-base-300", children: authUser == null ? void 0 : authUser.fullName })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("label", { className: "text-sm text-zinc-500 flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
            "Email Address"
          ] }),
          /* @__PURE__ */ jsx("p", { className: "px-4 py-2 mt-1 bg-base-200 rounded-lg border border-base-300", children: authUser == null ? void 0 : authUser.email })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "pt-6 border-t border-base-300", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold mb-4", children: "Account Info" }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2 border-b border-zinc-700", children: [
            /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: "Member Since" }),
            /* @__PURE__ */ jsx("span", { children: (_a = authUser == null ? void 0 : authUser.createdAt) == null ? void 0 : _a.split("T")[0] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between py-2", children: [
            /* @__PURE__ */ jsx("span", { className: "text-zinc-500", children: "Account Status" }),
            /* @__PURE__ */ jsx("span", { className: "text-green-500 font-medium", children: "Active" })
          ] })
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsx("div", { className: "fixed bottom-5 right-5 lg:hidden", children: /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: logout2,
        className: "btn btn-error text-white gap-2 shadow-lg",
        children: [
          /* @__PURE__ */ jsx(LogOutIcon, { className: "w-5 h-5" }),
          "Logout"
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(Footer, {})
  ] }) });
};
const App = ({ serverIsAuthenticated }) => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const isServerRender = serverIsAuthenticated !== void 0;
  const finalIsLoading = isServerRender ? false : isLoading;
  const finalAuthUser = isServerRender ? serverIsAuthenticated ? authUser : null : authUser;
  if (finalIsLoading) return /* @__PURE__ */ jsx(PageLoader, {});
  const isAuthenticated = finalAuthUser == null ? void 0 : finalAuthUser.isVerified;
  const isOnboarded = finalAuthUser == null ? void 0 : finalAuthUser.isOnboarded;
  return /* @__PURE__ */ jsxs("div", { className: "h-screen", "data-theme": theme, children: [
    /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/signup",
          element: !isAuthenticated ? /* @__PURE__ */ jsx(SignUpPage, {}) : /* @__PURE__ */ jsx(Navigate, { to: isOnboarded ? "/" : "/onboarding" })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "/verify-email", element: /* @__PURE__ */ jsx(EmailVerification, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/login",
          element: !isAuthenticated ? /* @__PURE__ */ jsx(LogInPage, {}) : /* @__PURE__ */ jsx(Navigate, { to: isOnboarded ? "/" : "/onboarding" })
        }
      ),
      /* @__PURE__ */ jsx(Route, { path: "/forgot-password", element: /* @__PURE__ */ jsx(ForgotPasswordPage, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/reset-password/:token", element: /* @__PURE__ */ jsx(ResetPassword, {}) }),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/onboarding",
          element: isAuthenticated ? !isOnboarded ? /* @__PURE__ */ jsx(OnboardingPage, {}) : /* @__PURE__ */ jsx(Navigate, { to: "/" }) : /* @__PURE__ */ jsx(Navigate, { to: "/login" })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/",
          element: isAuthenticated && isOnboarded ? /* @__PURE__ */ jsx(Layout, { showSidebar: true, children: /* @__PURE__ */ jsx(HomePage, {}) }) : /* @__PURE__ */ jsx(Navigate, { to: !isAuthenticated ? "/login" : "/onboarding" })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/update-profile",
          element: isAuthenticated && isOnboarded ? /* @__PURE__ */ jsx(UpdateProfilePage, {}) : /* @__PURE__ */ jsx(Navigate, { to: !isAuthenticated ? "/login" : "/onboarding" })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/notifications",
          element: isAuthenticated && isOnboarded ? /* @__PURE__ */ jsx(Layout, { showSidebar: true, children: /* @__PURE__ */ jsx(NotificationPage, {}) }) : /* @__PURE__ */ jsx(Navigate, { to: !isAuthenticated ? "/login" : "/onboarding" })
        }
      ),
      /* @__PURE__ */ jsx(
        Route,
        {
          path: "/friends",
          element: isAuthenticated && isOnboarded ? /* @__PURE__ */ jsx(Layout, { showSidebar: true, children: /* @__PURE__ */ jsx(FriendsPage, {}) }) : /* @__PURE__ */ jsx(Navigate, { to: !isAuthenticated ? "/login" : "/onboarding" })
        }
      )
    ] }),
    /* @__PURE__ */ jsx(Toaster, {})
  ] });
};
async function render(url, req) {
  console.log(`[SSR] Rendering URL: ${url}`);
  const queryClient = new QueryClient();
  const cookie = req.headers.cookie;
  const isPublicRoute = url.startsWith("/login") || url.startsWith("/signup") || url.startsWith("/forgot-password") || url.startsWith("/reset-password");
  if (isPublicRoute) {
    queryClient.setQueryData(["authUser"], null);
  } else {
    try {
      await queryClient.prefetchQuery({
        queryKey: ["authUser"],
        queryFn: () => getAuthUser(cookie)
      });
      if (url.startsWith("/friends")) {
        await queryClient.prefetchQuery({
          queryKey: ["friends"],
          queryFn: () => getUserFriends(cookie)
        });
      } else if (url === "/") {
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: ["user"],
            queryFn: () => getRecommUser(cookie)
          }),
          queryClient.prefetchQuery({
            queryKey: ["outgoingFriendReqs"],
            queryFn: () => getOutgoingFriendReqs(cookie)
          })
        ]);
      }
    } catch (error2) {
      console.error(
        `[SSR] Initial data fetch failed for ${url}. Client will take over.`,
        error2.message
      );
    }
  }
  const dehydratedState = dehydrate(queryClient);
  const appHtml = renderToString(
    /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(StaticRouter, { location: url, children: /* @__PURE__ */ jsx(App, {}) }) })
  );
  return { appHtml, dehydratedState };
}
export {
  render
};
