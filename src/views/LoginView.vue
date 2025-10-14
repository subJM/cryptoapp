<template>
  <div class="page page--login" data-page="login">
    <!-- HEADER -->
    <TopBackVue back="/"></TopBackVue>

    <div class="login">
      <div class="login__content">
        <h2 class="login__title">Login</h2>
        <div class="login-form">
          <form id="LoginForm" method="post" @submit.prevent="login">
            <div class="login-form__row">
              <label class="login-form__label">User ID</label>
              <input
                type="text"
                name="Username"
                v-model="form.user_id"
                value=""
                class="login-form__input required"
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
            <div class="login-form__forgot-pass">
              <a href="forgot-password.html">Forgot Password?</a>
            </div>
            <div class="login-form__row">
              <input
                type="submit"
                name="submit"
                class="login-form__submit button button--main button--full"
                id="submit"
                value="SIGN IN"
              />
            </div>
          </form>

          <div class="login-form__bottom">
            <p>
              Don't have an account? <br /><router-link to="/signup"
                >SIGNUP NOW!</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import axios from "@/lib/api";
import TopBackVue from "@/components/templates/inc/TopBack.vue";
import { useRouter } from "vue-router";
const router = useRouter();

// const form = reactive({
//   user_id: "thswhdals",
//   password: "1234",
// });
const form = reactive({
  user_id: "",
  password: "",
});
const login = async () => {
  try {
    const res = await axios.post("/api/users/account/login", form);
    // console.log(res);
    const resData = res.data;
    const resultData = resData.data[0];
    console.log(resultData);
    if (resData.result == "success") {
      localStorage.setItem("user_srl", resultData.id);
      localStorage.setItem("user_id", resultData.user_id);
      localStorage.setItem("user_name", resultData.username);
      localStorage.setItem("user_email", resultData.email);
      router.push("/home");
    }
  } catch (error) {
    router.push("/");
    console.log(error);
  }
};
</script>

<style lang="scss" scoped></style>
