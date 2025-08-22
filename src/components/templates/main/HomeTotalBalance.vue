<template>
  <div class="account-info">
    <div class="account-info__title">TOTAL BALANCE</div>
    <div class="account-info__total">{{ balance }} EVC</div>
    <div class="account-info__stats">
      <span class="plus">+$235</span> | <span class="plus">+12%</span>
    </div>
    <svg
      class="account-info__svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <path d="M0,0 Q50,201 100,0 L100,100 0,100 Z" fill="#0f0638" />
    </svg>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import axios from "axios";

const walletList = ref("");
const balance = ref(0);

//지갑 잔고 DB에서 가져오기
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
  console.log(res.data);
  if (resData.result == "success") {
    walletList.value = resData.data;
  }
  walletList.value.forEach(async (el) => {
    if (el.token_name == "EVC") {
      balance.value = el.balance;
      console.log(balance.value);
    }
  });
};

onMounted(() => {
  // getEthAddress();
  getAddressBalance();
});
</script>

<style lang="scss" scoped></style>
