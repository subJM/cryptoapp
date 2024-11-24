<template>
  <div class="page page--login" data-page="login">
    <!-- HEADER -->
    <TopBackVue back="/"></TopBackVue>

    <div class="login">
      <div class="login__content">
        <h2 class="login__title">Create an account</h2>
        <div class="login-form">
          <form id="LoginForm" method="post" @submit.prevent="signup">
            <div class="login-form__row">
              <label class="login-form__label">User ID</label>
              <input
                type="text"
                name="user_id"
                v-model="form.user_id"
                value=""
                class="login-form__input required"
              />
            </div>
            <div class="login-form__row">
              <label class="login-form__label">Username</label>
              <input
                type="text"
                name="username"
                v-model="form.username"
                value=""
                class="login-form__input required"
              />
            </div>
            <div class="login-form__row">
              <label class="login-form__label">Email</label>
              <input
                type="text"
                name="email"
                v-model="form.email"
                value=""
                class="login-form__input required email"
              />
            </div>
            <div class="login-form__row">
              <label class="login-form__label">Password</label>
              <input
                type="password"
                name="password"
                v-model="form.password"
                value=""
                class="login-form__input required"
              />
            </div>
            <div class="login-form__row">
              <input
                type="submit"
                name="submit"
                class="login-form__submit button button--main button--full"
                id="submit"
                value="SIGN UP"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "axios";
import TopBackVue from "@/components/templates/inc/TopBack.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
const router = useRouter();

const form = reactive({
  user_id: "",
  username: "",
  email: "",
  password: "",
});

const signup = async () => {
  // const form = {
  //   user_srl: localStorage.getItem("user_srl"),
  //   // token_name: "ETH",
  // };
  requestCheck(form);
  const res = await axios.post(
    "http://1.231.89.30:3000/users/account/signin",
    form
  );
  const resData = res.data;
  if (resData == "success") {
    const tronAccount = await axios.post(
      "http://1.231.89.30:3000/tron/create/account",
      form
    );
    if (tronAccount.data == "success") {
      router.push("/login");
    }
  } else if (resData == "exist") {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "이미 아이디가 존재합니다!",
    });
  }
};

const requestCheck = (sendForm) => {
  if (
    !sendForm.user_id ||
    !sendForm.username ||
    !sendForm.email ||
    !sendForm.password
  ) {
    throw "빈 곳을 입력해주세요";
  }
};
</script>

<style lang="scss" scoped></style>
