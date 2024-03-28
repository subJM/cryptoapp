<template>
  <div class="d-flex justify-content-between align-items-center p-3">
    <div :style="{ fontSize: '16px' }">My Portfolio</div>

    <div @click.prevent="reloadBalance"><i class="fa-solid fa-rotate"></i></div>
  </div>
  <swiper
    :effect="'cards'"
    :grabCursor="true"
    :modules="modules"
    :slideShadows="false"
    class="mySwiper"
    v-if="walletList.length > 0"
  >
    <swiper-slide v-for="wallet in walletList" :key="wallet.Id">
      <div
        class="swiper-container slider-portfolio slider-portfolio--round-corners slider-init mb-20"
      >
        <div
          class="swiper-slide slider-portfolio__slide slider-portfolio__slide--1h"
        >
          <div class="slider-portfolio__caption caption">
            <div class="caption__content">
              <router-link
                :to="`/history/${wallet.token_name}/${wallet.address}`"
              >
                <h2 class="caption__title">
                  <img
                    :src="`images/logos/${wallet.token_name}.png`"
                    alt=""
                    title=""
                  /><span>{{ wallet.wallet }}</span
                  ><strong>/ {{ wallet.token_name }}</strong>
                </h2>
                <div class="caption__chart">
                  <canvas class="chartdown" width="100%" height="60"></canvas>
                </div>
                <div class="caption__info">
                  <b>Address</b>
                  <b
                    :style="{
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      width: '100px',
                    }"
                    >{{ wallet.address }}</b
                  >
                </div>
                <div class="caption__info">
                  <b>Amount</b>
                  <b
                    >{{ formatBalance(wallet.balance) }}
                    {{ wallet.token_name }}</b
                  >
                </div>
                <div class="caption__info">
                  <strong>(ex) $72,500</strong>
                  <span class="minus"> -2%</span>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
  <swiper
    :effect="'cards'"
    :grabCursor="true"
    :modules="modules"
    :slideShadows="false"
    class="mySwiper"
    v-else
  >
    <swiper-slide>
      <div
        class="swiper-container slider-portfolio slider-portfolio--round-corners slider-init mb-40"
      >
        <div
          class="swiper-slide slider-portfolio__slide slider-portfolio__slide--1h"
        >
          <div class="slider-portfolio__caption caption">
            <div class="caption__content">
              <div
                class="d-flex justify-content-center align-items-center"
                :style="{ height: '150px', fontSize: '16px' }"
              >
                지갑 정보가 업습니다
              </div>
            </div>
          </div>
        </div>
      </div>
    </swiper-slide>
  </swiper>
</template>
<script setup>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from "swiper/vue";

// Import Swiper styles
import "swiper/css";

import "swiper/css/effect-cards";

// import required modules
import { EffectCards } from "swiper/modules";
import { onMounted, ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";
const router = useRouter();

const modules = [EffectCards];
const address = ref("");
const balance = ref("");
const walletList = ref("");
const user_id = localStorage.getItem("user_id");
if (user_id == "") {
  router.push("/");
}
//이더리움 주소 가져오기
const getEthAddress = async () => {
  try {
    const form = { user_id: user_id };
    var response = await axios.post(
      "http://localhost:3000/users/getEthAddress",
      form
    );
    localStorage.setItem("eth_address", response.data);
    address.value = response.data;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

//이더리움 잔고 DB에서 가져오기
const getAddressBalance = async () => {
  const form = {
    user_srl: localStorage.getItem("user_srl"),
    // token_name: "ETH",
  };
  const res = await axios.post(
    "http://localhost:3000/wallet/getAddressBalance",
    form
  );
  const resData = res.data;
  if (resData.result == "success") {
    walletList.value = resData.data;
  }
};

onMounted(() => {
  getEthAddress().then(async () => {
    try {
      //지갑주소로 체인에 연결해 잔고 가져오기
      const form = { address: address.value };
      var response = await axios.post(
        "http://localhost:3000/users/getAddressBalance",
        form
      );
      balance.value = Number(response.data.balance).toFixed(3);
    } catch (error) {
      console.error("Error fetching the- address:", error);
    }
  });
  getAddressBalance();
});

const formatBalance = (val) => {
  return Number(val).toFixed(5);
};

const reloadBalance = async () => {
  try {
    walletList.value.forEach(async (el) => {
      let form = {};
      let url = "";
      if (el.token_name == "ETH") {
        form = { address: address.value };
        url = "http://localhost:3000/users/getAddressBalance";
      } else {
        form = {
          token_name: el.token_name,
          address: el.address,
        };
        url = "http://localhost:3000/token/getBalance";
      }
      var response = await axios.post(url, form);
      balance.value = response.data.balance;
      if (el.balance != response.data.balance) {
        const updateForm = {
          user_srl: localStorage.getItem("user_srl"),
          token_name: el.token_name,
          balance: response.data.balance,
        };
        const updateUrl = "http://localhost:3000/wallet/updateWallet";
        await axios.post(updateUrl, updateForm);
      }
      window.location.reload();
    });
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};
</script>
<style scoped>
.swiper {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
}

.swiper {
  width: 280px;
  height: 230px;
  padding: 0px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;

  /* background-color: white; */
}
.swiper-slide-shadow .swiper-slide-shadow-cards {
  opacity: 0;
  height: 200px;
}
.swiper-slide-shadow-cards {
  height: 100px;
}
.swiper-slide-shadow {
  height: 100px;
}
</style>
