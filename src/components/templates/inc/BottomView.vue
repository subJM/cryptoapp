<template>
  <div class="bottom-navigation bottom-navigation--gradient">
    <ul class="bottom-navigation__icons">
      <li>
        <router-link to="/home">
          <img src="/images/icons/blocks.svg" alt="" title="" />
        </router-link>
      </li>
      <li>
        <router-link to="/list">
          <img src="/images/icons/stats.svg" alt="" title="" />
        </router-link>
      </li>
      <li class="centered">
        <router-link to="/send">
          <!-- <img src="/images/icons/wallet.svg" alt="" title=""/> -->
          <img src="/images/icons/swap.svg" alt="" title="" />
        </router-link>
      </li>
      <li>
        <router-link to="/notice" class="open-popup" data-popup="notifications">
          <img src="/images/icons/notifications.svg" alt="" title="" />
          <i
            ><span
              class="badge text-bg-transparent"
              :style="{
                color: '#000',
                fontSize: '7px',
              }"
              >New</span
            ></i
          >
          <!-- <h6>
            <span class="badge text-bg-secondary">New</span>
          </h6> -->
          <!-- <i>3</i> -->
        </router-link>
      </li>
      <li>
        <router-link to="/contact">
          <img src="/images/icons/contact.svg" alt="" title="" />
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
