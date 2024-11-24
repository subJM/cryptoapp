<template>
  <TopBackVue back="/home"></TopBackVue>
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  >
    <h2 class="page__title">
      <div class="d-flex justify-content-center align-items-center">
        <span :style="{ fontSize: '16px', paddingLeft: '5px' }"> Notice</span>
      </div>
    </h2>

    <div
      class="page__content page__content--with-header page__content--with-bottom-nav"
      :style="{ padding: '0' }"
    >
      <!-- <div :style="{ fontSize: '24px' }">{{ detail.title }}</div> -->
      <div class="fieldset">
        <div
          class="text-start"
          :style="{
            fontSize: '16px',
            fontWeight: 'bold',
            overflow: 'hidden',
            maxWidth: '100%',
          }"
        >
          {{ detail.title }}
        </div>
        <hr />
        <div class="text-start" :style="{ fontSize: '12px' }">
          <span
            >{{ detail.user_id }} •
            {{ changeTime(detail.create_at) }}
          </span>
        </div>
        <div
          class="text-start pt-4"
          :style="{ fontSize: '14px', lineHeight: '2.5rem' }"
        >
          {{ detail.content }}
        </div>
      </div>
    </div>
  </div>
  <BottomView></BottomView>
</template>

<script setup>
import TopBackVue from "@/components/templates/inc/TopBack.vue";

import BottomView from "@/components/templates/inc/BottomView.vue";
import axios from "axios";
import { useRoute } from "vue-router";
import { reactive } from "vue";

import moment from "moment-timezone";

const route = useRoute();
const detail = reactive({
  user_id: "",
  title: "",
  content: "",
  create_at: "",
  update_at: "",
});

const changeTime = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("MM월DD일 HH시mm분");
};

const getNoticeDetail = async () => {
  const url = "http://1.231.89.30:3000/notice/getNoticeDetail";
  const form = {
    id: route.params.id,
  };
  const res = await axios.post(url, form);
  const reponse = res.data;
  console.log("res : ", reponse.data[0]);
  if (reponse.result == "success") {
    detail.user_id = reponse.data[0].user_id;
    detail.title = reponse.data[0].title;
    detail.content = reponse.data[0].content;
    detail.create_at = reponse.data[0].create_at;
    detail.update_at = reponse.data[0].update_at;
  }
};
getNoticeDetail();
</script>

<style lang="scss" scoped></style>
