<template>
  <div class="d-flex justify-content-between align-items-center p-3">
    <div :style="{ fontSize: '16px' }">My Portfolio</div>

    <div @click.prevent="reloadBalance" :class="{ loading: isLoading }">
      <i class="fa-solid fa-rotate"></i>
    </div>
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
const isLoading = ref(false);
const walletList = ref([]);
const user_id = localStorage.getItem("user_id");
if (user_id == "") {
  router.push("/");
}
//이더리움 주소 가져오기 s
const getTronAddress = async () => {
  try {
    const form = { user_id: user_id };
    var response = await axios.post(
      // "http://211.45.175.111:3000/tron/getTronAddress",
      "http://211.45.175.111:3000/lott/getEthAddress",
      form
    );
    // localStorage.setItem("eth_address", response.data);
    localStorage.setItem("eth_address", response.data.address);

    address.value = response.data.address;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

//이더리움 잔고 DB에서 가져오기
const getAddressBalance = async () => {
  const form = {
    user_srl: localStorage.getItem("user_srl"),
    user_id: localStorage.getItem("user_id"),
    address: localStorage.getItem("eth_address"),
    // token_name: "ETH",
  };
  const res = await axios.post(
    "http://211.45.175.111:3000/wallet/getUserWallet",
    form
  );
  const resData = res.data;
  if (resData.result == "success") {
    walletList.value = resData.data;
  }
};

onMounted(() => {
  getTronAddress()
    .then(async () => {
      try {
        //지갑주소로 체인에 연결해 잔고 가져오기
        const form = {
          user_id: localStorage.getItem("user_id"),
          address: address.value,
        };
        var response = await axios.post(
          "http://211.45.175.111:3000/lott/getAddressBalance",
          form
        );
        balance.value = Number(response.data.balance).toFixed(3);
      } catch (error) {
        console.error("Error fetching the- address:", error);
      }
    })
    .then(async () => {
      reloadBalance().then(async () => {
        getAddressBalance();
      });
    });
});

const formatBalance = (val) => {
  return Number(val).toFixed(5);
};

const reloadBalance = async () => {
  if (isLoading.value) return; // 로딩 중인 경우 중복 호출 방지

  isLoading.value = true; // 로딩 상태 활성화

  try {
    await performReloadBalance();
  } catch (error) {
    console.error("Error reloading balance:", error);
  } finally {
    isLoading.value = false; // 로딩 상태 비활성화
  }
};

const performReloadBalance = async () => {
  try {
    for (const el of walletList.value) {
      let form = {};
      let url = "";
      console.log("performReloadBalance" + el.token_name);
      // 토큰별 요청 URL과 데이터 설정
      switch (el.token_name) {
        case "ETH":
          form = {
            user_id: localStorage.getItem("user_id"),
            address: address.value,
          };
          url = "http://211.45.175.111:3000/lott/getAddressBalance";
          break;
        case "EVC":
          form = {
            user_id: user_id,
            address: localStorage.getItem("eth_address"),
          };
          url = "http://211.45.175.111:3000/lott/getAddressTokenBalance";
          break;
        case "TRON":
          form = {
            user_id: user_id,
            address: localStorage.getItem("eth_address"),
          };
          url = "http://211.45.175.111:3000/tron/getAddressBalance";
          break;
        case "LOTT":
          form = {
            user_id: user_id,
            address: address.value,
          };
          url = "http://211.45.175.111:3000/lott/getAddressTokenBalance";
          break;
        default:
          continue; // 정의되지 않은 토큰은 스킵
      }

      // 잔액 갱신 요청 및 처리
      try {
        const response = await axios.post(url, form);
        const newBalance = response.data.balance;

        console.log(response);
        console.log(newBalance);

        if (el.balance != newBalance) {
          // 잔액 변경된 경우 업데이트 요청
          const updateForm = {
            user_srl: localStorage.getItem("user_srl"),
            user_id: user_id,
            token_name: el.token_name,
            beforeBalance: el.balance,
            balance: newBalance,
            address: localStorage.getItem("eth_address"),
          };
          const updateUrl = "http://211.45.175.111:3000/wallet/updateWallet";
          await axios.post(updateUrl, updateForm);
          window.location.reload();
        }
      } catch (error) {
        console.error(`Error updating balance for ${el.token_name}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in performReloadBalance:", error);
  }
};
setInterval(async () => {
  performReloadBalance();
}, 30000);
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
.loading {
  cursor: not-allowed; /* 로딩 중일 때 클릭 비활성화 스타일 */
  opacity: 0.5; /* 시각적 피드백 */
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
