<template>
  <div class="page page--splash" data-page="splash">
    <div class="splash">
      <div class="splash__content">
        <div class="splash__logo">Crypt<strong>EX</strong></div>
        <div class="splash__image">
          <img src="images/splash.png" alt="" title="" />
        </div>
        <div class="splash__text">
          Cryptex is your favourite Crypto Exchange Wallet
        </div>
        <div class="splash__buttons">
          <router-link to="/login" class="button button--full button--main">
            login
          </router-link>

          <router-link to="/signup" class="button button--full button--main">
            Signup
          </router-link>
        </div>
        <div class="splash__social-login">
          <p><a href="login.html">Allready Registered Login here</a></p>
          <div class="splash__social-icons">
            <a href="#" class="icon icon--social"
              ><img src="images/icons/facebook.svg" alt="" title=""
            /></a>
            <a href="#" class="icon icon--social"
              ><img src="images/icons/twitter.svg" alt="" title=""
            /></a>
            <a href="#" class="icon icon--social"
              ><img src="images/icons/instagram.svg" alt="" title=""
            /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
