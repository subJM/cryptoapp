<template>
  <TopNav></TopNav>
  <div class="page__content page__content--full page__content--with-bottom-nav">
    <AccountBalance></AccountBalance>
    <HomeMiddleButton></HomeMiddleButton>
    <div class="page-inner" :style="{ width: '100%' }">
      <!-- SLIDER AUTO 2 -->
      <HomePortfolioVue></HomePortfolioVue>

      <!-- <div class="history">
        <div class="history-header">
          <div class="d-flex justify-content-between align-items-center">
            <div :style="{ fontSize: '16px' }">History</div>
            <div>
              <div class="page__title-right">
                <a href="list.html" class="button button--main button--ex-small"
                  >VIEW ALL</a
                >
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <!-- END SLIDER AUTO 2 -->
      <!-- NOTICE -->
      <HomeNoticeVue></HomeNoticeVue>
      <!-- <HomeBannerVue></HomeBannerVue> -->
    </div>
  </div>
  <BottomView></BottomView>
</template>

<script setup>
import TopNav from "@/components/templates/inc/TopNav.vue";
import AccountBalance from "@/components/templates/main/HomeTotalBalance.vue";
import HomeMiddleButton from "@/components/templates/main/HomeMiddleButton.vue";
import HomePortfolioVue from "@/components/templates/main/HomePortfolio.vue";
// import HomeBannerVue from "@/components/templates/main/HomeBanner.vue";

import BottomView from "@/components/templates/inc/BottomView.vue";

import HomeNoticeVue from "@/components/templates/main/HomeNotice.vue";
</script>

<style scoped></style>
