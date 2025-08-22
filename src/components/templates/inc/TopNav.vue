<template>
  <!-- HEADER -->
  <header class="header header--fixed">
    <div class="header__inner">
      <div class="header__logo header__logo--text">
        <router-link to="/home"> LO<strong>TT</strong> </router-link>
      </div>
      <div class="header__icon open-panel" data-panel="left">
        <!-- <img src="/images/icons/user.svg" alt="image" title="image" /> -->
        <div class="dropdown">
          <a
            class="btn btn-secondary dropdown-toggle"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            MENU
          </a>

          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#">
                <div type="submit" @click.prevent="logout">
                  <i class="fa-solid fa-right-from-bracket"></i> Logout
                </div>
              </a>
            </li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import router from "@/router";

const logout = () => {
  localStorage.clear();
  router.push("/");
};
</script>

<style lang="scss" scoped></style>
