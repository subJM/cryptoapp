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
                <option value="ETH">ETH (Ethereum)</option>
                <option value="LOTT" selected>LOTT (LOTT)</option>
                <!-- <option value="EVC" selected>EVC (TRON)</option> -->
                <!-- <option value="TRON" selected>TRON (TRX)</option> -->
                <!-- <option value="BTC">BTC (Bitcoin)</option>  -->
              </select>
            </div>
          </div>

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
            :value="`${balance} ${token_name}`"
            class="form__input required text-end"
            readonly
          />
          <!-- <span v-show="TRONbalance < 5"
            >TRON이 10보다 작으면 전송이 실패할 수 있습니다 (
            <input
              :value="`현재 ${TRONbalance} TRX`"
              :readonly="true"
              style="background-color: transparent; color: red"
            />)</span
          > -->
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
            <img :src="`/images/icons/${history.status}.png`" alt="" title="" />
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

import axios from "@/lib/api";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

import Swal from "sweetalert2";
import moment from "moment-timezone";
const router = useRouter();
const route = useRoute();

const address = ref("");
const balance = ref("");
const TRONbalance = ref("");
const to_address = ref(route.params.address);
const amount = ref("0");
const token_name = ref("");
const selected_address = ref("");
const estimated = ref(0);

const sendHistoryData = ref([]);
const departDate = ref(true);
const create_date = ref("");

//클릭 방지
const isDisabled = ref(true);

const selectedCoin = ref("EVC");
const icon_url = ref(`/images/logos/${selectedCoin.value}.png`);

let tokenList = ref([]);

//토큰 리스트 보기
let isToken = false;

//TQoSpRDcRMqdhnJmSPuqaspmyWBJRcvbVP

watch(selectedCoin, (newSelectedCoin) => {
  icon_url.value = `/images/logos/${newSelectedCoin}.png`;
  // if (newSelectedCoin != "ETH") {
  //   isToken = false;
  // } else {
  //   isToken = true;
  // }
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
    if (selectedCoin.value == "eth") {
      selected_address.value = localStorage.getItem("eth_address");
    } else if (selectedCoin.value == "lott") {
      selected_address.value = localStorage.getItem("eth_address");
    } else if (selectedCoin.value == "tron") {
      selected_address.value = localStorage.getItem("tron_address");
    } else if (selectedCoin.value == "evc") {
      selected_address.value = localStorage.getItem("tron_address");
    }

    if (selected_address.value != null) {
      address.value = selected_address;
    } else {
      const form = { user_id: user_id };
      var response = await axios.post(
        "/users/getAddress",
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
      "/token/getTokenList",
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
    if (selectedCoin.value == "LOTT") {
      form = { address: address.value };
      url = "/lott/getAddressBalance";
    } else {
      form = {
        user_id: localStorage.getItem("user_id"),
        token_name: selectedCoin.value,
        address: address.value,
      };
      url = "/lott/getAddressTokenBalance";
    }
    console.log(form);
    var response = await axios.post(url, form);
    balance.value = response.data.balance;
    isDisabled.value = false;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

const getTRONBalance = async () => {
  try {
    var form = {};
    var url = "";

    form = { address: address.value };
    url = "/lott/getAddressBalance";

    console.log(form);
    var response = await axios.post(url, form);
    TRONbalance.value = response.data.balance;
    console.log("getTRONBalance : " + TRONbalance.value);
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

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
    url = "/lott/getAddressSendHistory";

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
        el.amount = Number(el.amount).toFixed(3);
        el.usedFee = Number(el.usedFee).toFixed(5);
        history.push(el);
      });
    }

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
  if (
    Number(balance.value) == 0 ||
    Number(TRONbalance.value) < 10 ||
    Number(balance.value) < Number(amount.value) + 10
  ) {
    Swal.fire({
      title: "잔고 부족!",
      text: "잔고를 확인해주세요",
      icon: "question",
    });
    return;
  }
  var url = "";
  const form = {
    user_srl: localStorage.getItem("user_srl"),
    user_id: user_id,
    from_address: address.value,
    to_address: to_address.value,
    token_name: selectedCoin.value,
    amount: amount.value,
  };

  url = "/lott/energytest";

  await axios.post(url, form).then((response) => {
    estimated.value = response.data.estimated.trxCost;
    Swal.fire({
      title: "코인을 전송하시겠습니까?",
      text: "예상 수수료: " + estimated.value,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        // sendToken을 호출할 때 익명 함수로 감싸기
        try {
          sendToken();
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "코인 전송에 실패했습니다.",
            icon: "error",
          });
        }
      }
    });
  });
};

var test = "TypeError: Cannot read properties of undefined (reading 'result')";
console.log("test : " + test.includes("Transaction not found"));

const sendToken = async () => {
  if (isDisabled.value) return; // 중복 클릭 방지

  isDisabled.value = true; // 버튼 비활성화

  try {
    var RequestApi = "";
    if (selectedCoin.value == "LOTT") {
      RequestApi = "/lott/transferToken";
    } else if (selectedCoin.value == "ETH") {
      RequestApi = "/lott/transfer";
    }

    const sendForm = {
      user_srl: localStorage.getItem("user_srl"),
      email: localStorage.getItem("user_email"),
      user_id: user_id,
      from_address: address.value,
      to_address: to_address.value,
      token_name: selectedCoin.value,
      amount: amount.value,
    };

    // 입력 데이터 검증
    await requestCheck(sendForm);

    // 송금 요청
    await axios.post(RequestApi, sendForm).then(async (res) => {
      const sendResult = res.data;
      if (sendResult.result == "success") {
        Swal.fire({
          title: "SENDING!",
          text: "코인이 전송되었습니다",
          icon: "success",
        });
      } else if (sendResult.result == "block") {
        Swal.fire({
          title: "ERROR",
          text: sendResult.message, //잠겨있어 전송할수 없습니다.
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: "코인 전송에 실패했습니다.",
          icon: "error",
        });
      }
    });
  } catch (error) {
    // 예외 처리
    console.error("송금 중 오류 발생:", error.message || error);
    Swal.fire({
      title: "Error!",
      text: "코인 전송에 실패했습니다.",
      icon: "error",
    });
  } finally {
    // 항상 버튼을 다시 활성화
    isDisabled.value = false;
  }
};

onMounted(() => {
  getHaveCoin();
  getAddress().then(async () => {
    getBalance();
    getSendTRONHistory(); //히스토리 가져오기
    getTRONBalance();
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
