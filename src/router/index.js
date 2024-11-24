import { createRouter, createWebHistory } from "vue-router";
import MainView from "@/views/MainView.vue";
import LoginView from "@/views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import SignupView from "@/views/SignupView.vue";
import HistoryView from "@/views/HistoryView.vue";
import ContactView from "@/views/ContactView.vue";
import ListView from "@/views/ListView.vue";
import SendView from "@/views/SendView.vue";
import NoticeView from "@/views/NoticeView.vue";
import NoticeDetailView from "@/views/NoticeDetailView.vue";
import KYCView from "@/views/KYCView.vue";
import ReceiveView from "@/views/ReceiveView.vue";
import ScanView from "@/views/ScanView.vue";
const routes = [
  {
    path: "/",
    name: "loading",
    meta: {
      requiresAuth: true,
    },
    component: MainView,
  },
  {
    path: "/login",
    name: "login",
    meta: {
      requiresAuth: true,
    },
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignupView,
  },
  {
    path: "/home",
    name: "home",
    component: HomeView,
  },
  {
    path: "/history/:coin/:address",
    name: "history",
    component: HistoryView,
  },
  {
    path: "/contact",
    name: "contact",
    component: ContactView,
  },
  {
    path: "/list",
    name: "list",
    component: ListView,
  },
  {
    path: "/send/",
    name: "send",
    component: SendView,
  },
  {
    path: "/send/:coinName/:address",
    name: "sendToAddress",
    component: SendView,
  },
  {
    path: "/notice",
    name: "notice",
    component: NoticeView,
  },
  {
    path: "/detail/:id",
    name: "detail",
    component: NoticeDetailView,
  },
  {
    path: "/receive",
    name: "Receive",
    component: ReceiveView,
  },
  {
    path: "/scan",
    name: "scan",
    component: ScanView,
  },
  {
    path: "/kyc",
    name: "kyc",
    component: KYCView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const isLoggedIn = localStorage.getItem("user_srl") == null ? true : false; // 예시로 localStorage에서 user_id를 체크
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  if (!requiresAuth) {
    if (isLoggedIn) {
      // 로그인이 필요한 페이지이고, 로그인되어 있지 않다면 로그인 페이지로 리다이렉트
      // router.push("/");
      console.log("test");
    }
  }
});

export default router;
