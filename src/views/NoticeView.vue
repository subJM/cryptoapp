<template>
  <TopBackVue back="/home"></TopBackVue>

  <!-- PAGE CONTENT -->
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  >
    <div class="search__form">
      <form>
        <input
          type="text"
          class="search__input"
          id=""
          name=""
          value=""
          placeholder="Search Cryptocurrencies"
          v-model="serchData"
        />
        <input
          type="submit"
          class="search__submit"
          value="Send"
          @click.prevent="serchNotice"
        />
      </form>
    </div>

    <h2 class="page__title">
      <div class="d-flex justify-content-center align-items-center">
        <span :style="{ fontSize: '20px', paddingLeft: '5px' }">Notice</span>
      </div>
    </h2>

    <div class="page__title-bar mt-20">
      <!-- <h3>Notice</h3> -->
    </div>
    <div
      class="d-flex justify-content-center align-items-center"
      v-if="historyList == ''"
      :style="{ height: '80%' }"
    >
      <div>공지사항이 없습니다</div>
    </div>
    <div class="cards cards--11">
      <div
        v-for="notice in NoticeData"
        :key="notice.id"
        :style="{ width: '100%' }"
      >
        <router-link class="card-coin" :to="`/detail/${notice.id}`">
          <div class="card-coin__logo">
            <img
              src="/images/icons/exclamation-solid.svg"
              alt=""
              srcset=""
              :style="{ height: '20px', paddingRight: '15px' }"
            />
            <div>
              <div
                class="text-start"
                :style="{
                  fontSize: '13px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  fontWeight: 'bold',
                  whiteSpace: 'nowrap',
                  width: '220px',
                }"
              >
                {{ notice.title }}
              </div>
              <div
                class="text-start pt-2"
                :style="{
                  fontSize: '11px',
                  color: '#BDBDBD',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxHeight: '30px',
                }"
              >
                {{ notice.content }}
              </div>
              <div
                class="text-start pt-3"
                :style="{
                  fontSize: '11px',
                  color: '#BDBDBD',
                }"
              >
                {{ changeTime(notice.create_at) }}
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>

  <BottomView></BottomView>
</template>

<script setup>
// import TopNav from "@/components/templates/inc/TopNav.vue";
import TopBackVue from "@/components/templates/inc/TopBack.vue";
import BottomView from "@/components/templates/inc/BottomView.vue";

// import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ref } from "vue";

import moment from "moment-timezone";

// const router = useRouter();
// router.push("/home");

const NoticeData = ref();
const serchData = ref("");

const changeTime = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("MM월DD일 HH시mm분");
};

const getNotice = async () => {
  const url = `http://1.231.89.30:3000/notice/getNotice`;
  const res = await axios.get(url);
  const response = res.data;
  if (response.result == "success") {
    NoticeData.value = response.data;
  }
  console.log(NoticeData.value);
};
getNotice();

const serchNotice = async () => {
  const form = {
    search: serchData.value,
  };
  console.log(form);
  const url = `http://1.231.89.30:3000/notice/searchNotice`;
  const res = await axios.post(url, form);
  const response = res.data;
  if (response.result == "success") {
    NoticeData.value = response.data;
  }
};
</script>

<style scoped></style>
