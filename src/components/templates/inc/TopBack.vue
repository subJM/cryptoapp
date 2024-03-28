<template>
  <!-- HEADER -->
  <header class="header header--fixed">
    <div class="header__inner">
      <div class="header__icon">
        <router-link :to="props.back"
          ><img src="/images/icons/arrow-back.svg" alt="" title=""
        /></router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps({
  back: String,
});
</script>

<style lang="scss" scoped></style>
