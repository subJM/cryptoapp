<template>
  <TopBackVue back="/home"></TopBackVue>
  <!-- PAGE CONTENT -->
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
    style="height: 100%"
  >
    <h2 class="page__title">Transfer</h2>
    <div class="fieldset">
      <div class="form">
        <form id="Form" method="post" action="checkout.html">
          <div class="form__row">
            <div class="form__select">
              <select
                v-model="selectedCoin"
                id="select_coin"
                name="select_coin"
                class="required text-center"
              >
                <option
                  v-for="token in tokenList"
                  :key="token.Id"
                  :value="token.token_name"
                  :selected="token.token_name == ETH ? true : false"
                >
                  {{ token.token_name }} ({{ token.wallet }})
                </option>
                <!-- <option value="EVC" selected>EVC (TRON)</option> -->
                <!-- <option value="TRON" selected>TRON (TRX)</option> -->
                <!-- <option value="BTC">BTC (Bitcoin)</option> -->
              </select>
            </div>
          </div>

          <!-- 토큰일경우 아래하나더 생기지만 필요없이  -->
          <div class="form__row" v-show="isToken">
            <div class="form__select">
              <select
                v-model="token_name"
                id="select_token"
                name="select_token"
                class="required text-center"
              >
                <!-- <option value="ETH" selected>ETH (Ethereum)</option> -->
                <option
                  v-for="token in tokenList"
                  :key="token.Id"
                  :value="token.token_name"
                  :selected="token.token_name == ETH ? true : false"
                >
                  {{ token.token_name }} ({{ token.wallet }})
                </option>
              </select>
            </div>
          </div>

          <div class="form__row">
            <div>
              <span
                :style="{
                  fontSize: '1.6rem',
                  fontWeight: '600',
                }"
                >TO :
              </span>
              <input
                type="text"
                name="Text"
                v-model="to_address"
                value=""
                class="form__input required text-end to_address"
                placeholder="type Address"
              />
            </div>
          </div>
          <div class="form__row d-flex align-items-center justify-space">
            <div class="form__coin-icon text-start">
              <span class="p-0">{{ selectedCoin }}:</span>
            </div>
            <input
              type="number"
              name="Text"
              value=""
              class="form__input text-end to_amount"
              placeholder="type send amount"
              autocomplete="off"
              v-model="amount"
            />
            <span class="form__coin-icon">
              <img :src="`${icon_url}`" alt="" title="" />
            </span>
          </div>

          <!-- <div class="form__coin-total">2,465.00 LOTT</div> -->
        </form>
      </div>
    </div>
    <h2 class="page__title">Wallet address</h2>
    <div class="fieldset">
      <div class="form">
        <div class="text-start">address :</div>
        <div class="form__row">
          <input
            type="text"
            name="address"
            :value="`${address}`"
            class="form__input required text-end"
            readonly
          />
        </div>
        <div class="text-start">balance :</div>
        <div class="form__row">
          <input
            type="text"
            name="Text"
            :value="`${balance} ${selectedCoin}`"
            class="form__input required text-end"
            readonly
          />
          <span v-show="ETHbalance < 5"
            >ETH가 0.05보다 작으면 전송이 실패할 수 있습니다 (
            <input
              :value="`현재 ${ETHbalance} ETH`"
              :readonly="true"
              style="background-color: transparent; color: red"
            />)</span
          >
        </div>
      </div>
    </div>
    <div class="d-grid gap-2">
      <button
        type="submit"
        :style="{
          height: '50px',
          fontSize: '16px',
          backgroundColor: isDisabled
            ? 'rgb(200, 200, 200)' // 비활성화 시 색상
            : 'rgb(205 191 221)',
          borderRadius: '25px',
        }"
        :disabled="isDisabled"
        @click.prevent="Toast"
      >
        Send Token
      </button>
    </div>
    <h2 class="page__title pt-5">History</h2>

    <!-- 최근 전송 히스토리 -->
    <div
      class="d-flex justify-content-center align-items-center"
      v-if="sendHistory == ''"
      :style="{ height: '80%' }"
    >
      <div>거래내역이 없습니다</div>
    </div>
    <div class="cards cards--11">
      <div
        v-for="history in sendHistoryData"
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
            <!-- <img src="/images/icons/minus-solid.svg" alt="" title="" /> -->
            <img :src="`${icon_url}`" alt="" title="" />
            <!-- <span
              class="me-4"
              :style="{
                fontSize: '12px',
              }"
              >{{ history.status }}</span
            > -->
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
</template>

<script setup>
import TopBackVue from "@/components/templates/inc/TopBack.vue";

import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import Swal from "sweetalert2";
import moment from "moment-timezone";
const router = useRouter();
const route = useRoute();

const address = ref("");
const balance = ref("");
const ETHbalance = ref("");
const to_address = ref(route.params.address);
const amount = ref("0");
const token_name = ref("ETH");
const estimated = ref(0);

const sendHistoryData = ref([]);
const departDate = ref(true);
const create_date = ref("");
const tokenAddress = ref("");

//클릭 방지
const isDisabled = ref(false);

const selectedCoin = ref("ETH");
const icon_url = ref(`/images/logos/${selectedCoin.value}.png`);

let tokenList = ref([]);

//토큰 리스트 보기
let isToken = false;
//TQoSpRDcRMqdhnJmSPuqaspmyWBJRcvbVP

watch(selectedCoin, (newSelectedCoin) => {
  icon_url.value = `/images/logos/${newSelectedCoin}.png`;
  if (newSelectedCoin == "LOTT") {
    isToken = false;
    tokenAddress.value = "0xbA93EF534094F8b7001ECe2691168140965341ab";
  } else {
    // isToken = true;
    isToken = false;
    tokenAddress.value = "";
  }

  // if (selectedCoin.value == "TRX") {
  // }
  console.log(selectedCoin.value);
  getAddress().then(async () => {
    getBalance();
    getSendTRONHistory();
  });
});
watch(token_name, () => {
  // console.log(selectedCoin);
  // if (selectedCoin.value == "TRON") {
  //   getAddress().then(async () => {
  //     getBalance();
  //   });
  //   console.log("check");
  //   console.log(balance.value);
  // }
});

const user_id = localStorage.getItem("user_id");
if (user_id == "") {
  router.push("/");
}

const getAddress = async () => {
  try {
    const eth_address = localStorage.getItem("eth_address");

    if (eth_address != null) {
      address.value = eth_address;
    } else {
      const form = { user_id: user_id };
      var response = await axios.post(
        "/api/users/getAddress",
        form
      );
      address.value = response.data;
    }
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

const getHaveCoin = async () => {
  try {
    isDisabled.value = true;
    const form = {
      user_srl: localStorage.getItem("user_srl"),
    };
    // console.log(form);

    var res = await axios.post(
      "/api/token/getTokenList",
      form
    );
    const result = res.data;
    tokenList = result.data;
    isDisabled.value = false;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

const getBalance = async () => {
  try {
    var form = {};
    var url = "";

    isDisabled.value = true; //클릭방지
    if (selectedCoin.value != "LOTT") {
      form = {
        user_id: localStorage.getItem("user_id"),
        address: address.value,
      };
      url = "/api/tron/getAddressBalance";
    } else {
      form = {
        user_id: localStorage.getItem("user_id"),
        token_name: selectedCoin.value,
        address: address.value,
      };
      url = "/api/tron/getAddressTokenBalance";
    }
    console.log(form);
    var response = await axios.post(url, form);

    balance.value = toMoney2(response.data.balance);
    isDisabled.value = false;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

const getETHbalance = async () => {
  try {
    var form = {};
    var url = "";

    form = { user_id: localStorage.getItem("user_id"), address: address.value };
    url = "/api/tron/getAddressBalance";

    var response = await axios.post(url, form);
    ETHbalance.value = toMoney2(response.data.balance);
    console.log("getETHbalance : " + ETHbalance.value);
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

// 안전 변환 유틸
function toMoney2(val, fallback = "0.00") {
  if (val === null || val === undefined) return fallback;
  const n = parseFloat(String(val)); // "0.", "0", 0 모두 ok
  return Number.isFinite(n) ? n.toFixed(8) : fallback; // toFixed는 문자열 반환
}

//보낸 내역 체크
const getSendTRONHistory = async () => {
  try {
    var form = {};
    var url = "";

    form = {
      user_srl: localStorage.getItem("user_srl"),
      user_id: user_id,
      coin_name: selectedCoin.value,
      address: address.value,
      type: "withdraw",
    };
    url = "/api/tron/getAddressSendHistory";

    var response = await axios.post(url, form);
    let history = [];
    var responseData = response.data;
    if (responseData.result == "success") {
      responseData.data.forEach((el) => {
        if (changeDate(el.create_at) != create_date.value) {
          create_date.value = changeDate(el.create_at);
          el.departDate = true;
        } else {
          departDate.value = false;
          el.departDate = false;
        }
        el.amount = Number(el.amount).toFixed(8);
        el.usedFee = Number(el.usedFee).toFixed(8);
        history.push(el);
      });
    }
    console.log(history);
    sendHistoryData.value = history;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

const changeDate = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("YY.MM.DD");
};
const changeTime = (datetime) => {
  return moment(datetime).tz("Asia/Seoul").format("MM월DD일 HH시mm분");
};

const Toast = async () => {
  try {
    const form = {
      user_srl: localStorage.getItem("user_srl"),
      user_id,
      from_address: address.value,
      to_address: to_address.value,
      token_name: selectedCoin.value, // "ETH" 또는 "LOTT"(ERC-20)
      amount: amount.value,
      // ERC-20이면 반드시 토큰 주소 포함
      token_address:
        selectedCoin.value !== "ETH" ? tokenAddress.value : undefined,
    };

    const url = "/api/tron/evmfeetest";
    const { data } = await axios.post(url, form);
    const est = data?.estimated;
    if (!est) {
      throw new Error("수수료 추정 결과가 없습니다.");
    }

    // EIP-1559 우선, 없으면 legacy 사용
    const feeNativeStr =
      est.eip1559?.estimatedFeeNative ?? est.legacy?.estimatedFeeNative;
    const feeNative = Number(feeNativeStr || 0);
    const gasLimit = est.gasLimit;
    const gasPriceGwei =
      est.eip1559?.maxFeePerGasGwei ?? est.legacy?.gasPriceGwei ?? "N/A";

    // 동적 잔고 검증
    let ok = true;
    let warnMsg = "";
    if ((form.token_name || "").toUpperCase() === "ETH") {
      // 총 필요량 = 전송액 + 가스비
      const totalNeed = Number(est.required?.totalNeedNative || 0);
      const balanceEth = Number(est.balanceNative || 0);
      if (balanceEth < totalNeed) {
        ok = false;
        warnMsg = `필요 ${totalNeed.toFixed(8)} ETH, 보유 ${balanceEth.toFixed(
          8
        )} ETH`;
      }
    } else {
      // ERC-20: 가스비만 필요(ETH)
      const feeOnly = Number(est.required?.feeOnlyNative || feeNative);
      const balanceEth = Number(est.balanceNative || 0);
      if (balanceEth < feeOnly) {
        ok = false;
        warnMsg = `가스비 필요 ${feeOnly.toFixed(
          8
        )} ETH, 보유 ${balanceEth.toFixed(8)} ETH`;
      }
    }

    // 사용자 표시용 요약
    const network = est.network; // 예: mainnet(1)
    const symbol = est.symbol || "ETH"; // 네이티브/표시 심볼
    const summaryLines = [
      `네트워크: ${network}`,
      `가스 한도: ~${gasLimit}`,
      `가스 가격: ~${gasPriceGwei} gwei`,
      (form.token_name || "").toUpperCase() === "ETH"
        ? `예상 수수료: ~${feeNative.toFixed(8)} ETH / 총 필요량: ${Number(
            est.required?.totalNeedNative || 0
          ).toFixed(8)} ${symbol}`
        : `예상 수수료(ETH): ~${feeNative.toFixed(8)} / 수수료만 필요`,
      warnMsg ? `잔고 부족: ${warnMsg}` : "",
    ].filter(Boolean);

    // 화면에도 남기고 싶다면
    estimated.value = feeNative.toFixed(8);

    const result = await Swal.fire({
      title: "코인을 전송하시겠습니까?",
      text: summaryLines.join("\n"),
      icon: ok ? "warning" : "error",
      showCancelButton: true,
      confirmButtonColor: ok ? "#3085d6" : "#aaa",
      cancelButtonColor: "#d33",
      confirmButtonText: ok ? "Yes, send it!" : "잔고 부족",
      allowOutsideClick: false,
    });

    if (ok && result.isConfirmed) {
      await sendToken(); // 실제 전송
    }
  } catch (error) {
    console.error("수수료 추정 오류:", error?.message || error);
    Swal.fire({
      title: "오류",
      text: error?.message || "수수료 추정에 실패했습니다.",
      icon: "error",
    });
  }
};

var test = "TypeError: Cannot read properties of undefined (reading 'result')";
console.log("test : " + test.includes("Transaction not found"));

const sendToken = async () => {
  if (isDisabled.value) return;
  isDisabled.value = true;

  try {
    let RequestApi = "";
    if (selectedCoin.value === "ETH") {
      RequestApi = "/api/tron/transfer";
    } else {
      // ERC-20(LOTT 포함) 일반화
      // if (user_id == "hyunu33") {
      //   RequestApi = "/api/tron/transferToken_private";
      // } else {
      //   RequestApi = "/api/tron/transferToken";
      // }
      RequestApi = "/api/tron/transferToken_private";
    }

    const sendForm = {
      user_srl: localStorage.getItem("user_srl"),
      email: localStorage.getItem("user_email"),
      user_id,
      from_address: address.value,
      to_address: to_address.value,
      token_name: selectedCoin.value,
      amount: amount.value,
      // ERC-20이면 토큰 주소도 포함
      token_address:
        selectedCoin.value !== "ETH" ? tokenAddress.value : undefined,
    };

    await requestCheck(sendForm); // 유효성 검증

    const { data: sendResult } = await axios.post(RequestApi, sendForm);

    if (sendResult.result === "success") {
      Swal.fire({
        title: "SENDING!",
        text: "코인이 전송되었습니다",
        icon: "success",
      });
      // TODO: 잔고 재조회/화면 갱신 로직
    } else if (sendResult.result === "block") {
      Swal.fire({
        title: "ERROR",
        text: sendResult.message || "잠겨있어 전송할 수 없습니다.",
        icon: "error", // ← success → error 로 변경
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: sendResult.message || "코인 전송에 실패했습니다.",
        icon: "error",
      });
    }
  } catch (error) {
    console.error("송금 중 오류 발생:", error?.message || error);
    Swal.fire({
      title: "Error!",
      text: error?.message || "코인 전송에 실패했습니다.",
      icon: "error",
    });
  } finally {
    isDisabled.value = false;
  }
};

onMounted(() => {
  getHaveCoin();
  getAddress().then(async () => {
    getBalance();
    getSendTRONHistory(); //히스토리 가져오기
    getETHbalance();
  });
});

const requestCheck = async (sendForm) => {
  if (
    !sendForm.user_id ||
    !sendForm.user_srl ||
    !sendForm.from_address ||
    !sendForm.to_address ||
    !sendForm.token_name ||
    !sendForm.amount ||
    parseFloat(sendForm.amount) <= 0 // 송금 금액이 0 이하인 경우 방지
  ) {
    throw "Please fill in the empty space or check the input values.";
  }
};
</script>

<style scoped>
option {
  background-color: #0f0638;
}
.to_address {
  width: calc(100% - 35px);
}
.to_amount {
  width: calc(100% - 65px);
}
</style>
