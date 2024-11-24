<template>
  <TopBackVue back="/home"></TopBackVue>

  <!-- PAGE CONTENT -->
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  >
    <!-- <div class="search__form">
      <form>
        <input
          type="text"
          class="search__input"
          id=""
          name=""
          value=""
          placeholder="Search Cryptocurrencies"
        />
        <input type="submit" class="search__submit" value="Send" />
      </form>
    </div> -->

    <h2 class="page__title">
      <div class="d-flex justify-content-center align-items-center">
        <img :src="`${wallet_icon}`" :style="{ width: '20px' }" />
        <span :style="{ fontSize: '20px', paddingLeft: '5px' }"
          >{{ coin_name }} Wallet</span
        >
      </div>
    </h2>

    <div class="page__title-bar mt-20">
      <h3>Transaction History</h3>
    </div>
    <div
      class="d-flex justify-content-center align-items-center"
      v-if="historyList == ''"
      :style="{ height: '80%' }"
    >
      <div>거래내역이 없습니다</div>
    </div>
    <div class="cards cards--11">
      <div
        v-for="history in historyList"
        :key="history.id"
        :style="{ width: '100%' }"
      >
        <div
          class="text-start"
          :style="{
            color: '#C7C7C7',
            fontSize: '12px',
          }"
          v-if="history.departDate"
        >
          {{ changeDate(history.create_at) }}
        </div>
        <a class="card-coin" href="#">
          <div class="card-coin__logo">
            <img
              src="/images/icons/plus-bold.svg"
              alt=""
              title=""
              v-if="history.action == 'receive'"
            />
            <img
              src="/images/icons/minus-solid.svg"
              alt=""
              title=""
              v-if="history.action == 'send'"
            />
            <span
              class="text-start"
              :style="{
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '130px',
              }"
            >
              <!-- <span v-if="history.IsExternalTrade == 'yes'">외부</span>
              <span v-if="history.IsExternalTrade == 'no'">내부</span> -->
              {{ history.to_address }}
              <b>{{ changeTime(history.create_at) }}</b>
            </span>
          </div>
          <div class="card-coin__price">
            <strong :style="{ fontSize: '12px' }"
              >{{ history.amount }} {{ history.token_name }}</strong
            ><span class="plus" :style="{ fontSize: '12px' }"
              >{{ history.usedFee }} Fee</span
            >
          </div>
        </a>
      </div>
    </div>
  </div>

  <BottomView></BottomView>
</template>

<script setup>
// import TopNav from "@/components/templates/inc/TopNav.vue";
import TopBackVue from "@/components/templates/inc/TopBack.vue";
import BottomView from "@/components/templates/inc/BottomView.vue";

import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ref } from "vue";

import moment from "moment-timezone";

const route = useRoute();
const router = useRouter();
const coin_name = route.params.coin;
const address = route.params.address;
const wallet_icon = `/images/logos/${coin_name}.png`;
if (coin_name == "") {
  router.push("/home");
}
const departDate = ref(true);
const create_date = ref("");

const historyData = ref();
let historyList = ref();
const changeDate = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("YY.MM.DD");
};
const changeTime = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("MM월DD일 HH시mm분");
};

const getHistory = async () => {
  const form = {
    user_srl: localStorage.getItem("user_srl"),
    token_name: coin_name,
    address: address,
  };
  const url = `http://1.231.89.30:3000/wallet/getHistory`;
  const res = await axios.post(url, form);
  const response = res.data;
  historyData.value = response.data;
  let history = [];
  if (response.result == "success") {
    response.data.forEach((el) => {
      if (changeDate(el.create_at) != create_date.value) {
        create_date.value = changeDate(el.create_at);
        el.departDate = true;
      } else {
        departDate.value = false;
        el.departDate = false;
      }

      el.amount = Number(el.amount).toFixed(3);
      el.usedFee = Number(el.usedFee).toFixed(5);
      history.push(el);
    });
  }
  console.log(history);
  historyList.value = history;
};
getHistory();
</script>

<style scoped></style>
