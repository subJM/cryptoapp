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
              <label class="login-form__label">Username</label>
              <input
                type="text"
                name="Username"
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
const form = reactive({
  username: "",
  email: "",
  password: "",
});

const signup = () => {
  const res = axios.post();
  console.log(res);
};
</script>

<style lang="scss" scoped></style>
