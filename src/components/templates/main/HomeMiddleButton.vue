<template>
  <div class="account-buttons">
    <a href="/receive">
      <img src="images/icons/bottom.svg" alt="" title="" />
      <span :style="{ fontSize: '9px' }"> RECEIVE </span>
    </a>
    <router-link to="/send">
      <img src="images/icons/top.svg" alt="" title="" />
      <span :style="{ fontSize: '9px' }"> SEND </span>
    </router-link>
    <router-link to="/scan">
      <img src="images/icons/scan.svg" alt="" title="" />
      <span :style="{ fontSize: '9px' }">SCAN</span>
    </router-link>
    <!-- <a href="transfer.html"
      ><img src="images/icons/swap.svg" alt="" title="" /><span>SWAP</span></a
    > -->
  </div>
</template>

<script setup></script>

<style lang="scss" scoped></style>
