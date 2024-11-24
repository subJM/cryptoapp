<template>
  <div class="d-flex justify-content-between align-items-center p-3">
    <div>NOTICE</div>
    <div>
      <router-link to="/notice">
        <i class="fa-solid fa-bars"></i>
      </router-link>
    </div>
  </div>
  <div class="notice" :style="{ paddingTop: '15px' }">
    <div v-for="notice in noticeList" :key="notice.id">
      <router-link :to="`/detail/${notice.id}`">
        <div class="notice-content d-flex justify-content-between mt-3">
          <div>{{ changeDate(notice.createAt) }}</div>
          <div
            class="text-end"
            :style="{
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              maxWidth: '180px',
              whiteSpace: 'nowrap',
            }"
          >
            {{ notice.title }}
          </div>
        </div>
        <hr />
      </router-link>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import moment from "moment-timezone";
const changeDate = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("MM.DD");
};

const noticeList = ref();

const getNotice = async () => {
  const url = `http://1.231.89.30:3000/notice/getNotice`;
  const res = await axios.get(url);
  const response = res.data;
  if (response.result == "success") {
    noticeList.value = response.data;
  }
};
getNotice();
</script>

<style scoped>
.notice {
  background-color: #291f57;
  /* border: 1px solid #333; */
  border-radius: 10px;
  padding: 10px;
}
a {
  color: rgb(224, 224, 224);
  text-decoration: none;
}
</style>
