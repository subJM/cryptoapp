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
                v-model="user_id"
                value=""
                class="login-form__input required"
              />
            </div>
            <div class="login-form__row">
              <label class="login-form__label">Username</label>
              <input
                type="text"
                name="username"
                v-model="username"
                value=""
                class="login-form__input required"
              />
            </div>
            <div class="login-form__row">
              <label class="login-form__label">Email</label>
              <input
                type="text"
                name="email"
                v-model="email"
                value=""
                class="login-form__input required email"
              />
            </div>
            <div class="login-form__row">
              <label class="login-form__label">Password</label>
              <input
                type="password"
                name="password"
                v-model="password"
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
                :disabled="isDisabled"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TopBackVue from "@/components/templates/inc/TopBack.vue";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import axios from "@/lib/api";
const router = useRouter();

const isDisabled = ref(false);

const user_id = ref("");
const username = ref("");
const email = ref("");
const password = ref("");

const signup = async () => {
  if (isDisabled.value == true) {
    return;
  }
  isDisabled.value = true;

  // const form = {
  //   user_id: user_id.value,
  //   username: username.value,
  //   email: email.value,
  //   password: password.value,
  // };

  // const res = await axios.post(
  //   "/users/account/signin",
  //   form
  // );
  // const resData = res.data;
  // console.log(resData);
  // if (resData == "success") {
  const form = {
    user_id: user_id.value,
    username: username.value,
    email: email.value,
    password: password.value,
  };
  requestCheck(form);

  const tronAccount = await axios.post("/api/lott/create_account", form);
  console.log("지갑생성완료");
  console.log(tronAccount.data);
  // if (tronAccount.data == "success") {
  if (tronAccount.data.result == "success") {
    router.push("/login");
  }
  // } else
  if (tronAccount.data == "exist") {
    Swal.fire({
      icon: "error",
      title: "ERROR",
      text: "아이디 또는 이메일이 존재합니다!",
    }).then(() => {
      window.location.reload();
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
    Swal.fire({
      icon: "error",
      title: "ERROR",
      text: "빈 곳을 입력해주세요",
    });
  }
};
</script>

<style lang="scss" scoped></style>
