<template>
  <TopBackVue back="/home" />
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
    style="height: 100%"
  >
    <h2 class="page__title">Transfer</h2>

    <div class="fieldset">
      <div class="form">
        <form id="Form" method="post" action="#">
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
                >
                  {{ token.token_name }} ({{ token.wallet }})
                </option>
              </select>
            </div>
          </div>

          <div class="form__row">
            <div>
              <span :style="{ fontSize: '1.6rem', fontWeight: '600' }">TO : </span>
              <input
                type="text"
                v-model="to_address"
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
              class="form__input text-end to_amount"
              placeholder="type send amount"
              autocomplete="off"
              v-model="amount"
              min="0"
              step="any"
            />
            <span class="form__coin-icon">
              <img :src="icon_url" alt="" title="" />
            </span>
          </div>
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
            :value="address"
            class="form__input required text-end"
            readonly
          />
        </div>

        <div class="text-start">balance :</div>
        <div class="form__row">
          <input
            type="text"
            :value="`${balance} ${selectedCoin}`"
            class="form__input required text-end"
            readonly
          />
          <span v-show="TRXbalance < 5">
            TRX가 5보다 작으면 전송이 실패할 수 있습니다 (
            <input
              :value="`현재 ${TRXbalance} TRX`"
              :readonly="true"
              style="background-color: transparent; color: red"
            />)
          </span>
        </div>
      </div>
    </div>

    <div class="d-grid gap-2">
      <button
        type="button"
        :style="{
          height: '50px',
          fontSize: '16px',
          backgroundColor: isDisabled ? 'rgb(200, 200, 200)' : 'rgb(205 191 221)',
          borderRadius: '25px',
        }"
        :disabled="isDisabled"
        @click.prevent="Toast"
      >
        Send Token
      </button>
    </div>

    <h2 class="page__title pt-5">History</h2>

    <div
      class="d-flex justify-content-center align-items-center"
      v-if="sendHistoryData.length === 0"
      :style="{ height: '80%' }"
    >
      <div>거래내역이 없습니다</div>
    </div>

    <div class="cards cards--11" v-else>
      <div
        v-for="history in sendHistoryData"
        :key="history.id"
        :style="{ width: '100%' }"
      >
        <div
          class="text-start"
          :style="{ color: '#C7C7C7', fontSize: '12px' }"
          v-if="history.departDate"
        >
          {{ changeDate(history.create_at) }}
        </div>
        <a class="card-coin" href="#">
          <div class="card-coin__logo">
            <img :src="icon_url" alt="" title="" />
            <span
              class="text-start"
              :style="{
                fontSize: '12px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '130px',
              }"
            >
              {{ history.to_address }}
              <b>{{ changeTime(history.create_at) }}</b>
            </span>
          </div>
          <div class="card-coin__price">
            <strong :style="{ fontSize: '12px' }"
              >{{ history.amount }} {{ history.token_name }}</strong
            >
            <span class="plus" :style="{ fontSize: '12px' }"
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
const balance = ref("0.00000000");
const TRXbalance = ref(0); // 네이티브 TRX
const to_address = ref(route.params.address || "");
const amount = ref("0");
const estimated = ref(0);

const sendHistoryData = ref([]);
const create_date = ref("");

const isDisabled = ref(false);

const selectedCoin = ref("TRON"); // 기본 TRON(네이티브)
const icon_url = ref(`/images/logos/${selectedCoin.value}.png`);

const tokenList = ref([]); // [{ wallet:'TRON', token_name:'TRON'|'LOTT', ... }]

watch(selectedCoin, async (newSelectedCoin) => {
  icon_url.value = `/images/logos/${newSelectedCoin}.png`;
  await getAddress();
  await getBalance();
  await getSendHistory();
});

const user_id = localStorage.getItem("user_id") || "";
if (!user_id) {
  router.push("/");
}

const getAddress = async () => {
  try {
    const saved = localStorage.getItem("address");
    if (saved) {
      address.value = saved;
      return;
    }
    const form = { user_id };
    const { data } = await axios.post("/api/tron/getAddress", form);
    address.value = data?.address || "";
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

const getHaveCoin = async () => {
  try {
    isDisabled.value = true;
    const form = { user_srl: localStorage.getItem("user_srl") };
    const { data } = await axios.post("/api/tron/getTokenList", form);
    tokenList.value = data?.data || [];
  } catch (error) {
    console.error("Error getHaveCoin:", error);
  } finally {
    isDisabled.value = false;
  }
};

const getBalance = async () => {
  if (!address.value) return;
  try {
    isDisabled.value = true;
    let url = "";
    let form = {};

    if (selectedCoin.value === "LOTT") {
      url = "/api/tron/getAddressTokenBalance";
      form = { address: address.value };
    } else {
      url = "/api/tron/getAddressBalance";
      form = { address: address.value };
    }

    const res = await axios.post(url, form);
    const val = Number(res?.data?.balance ?? 0);
    balance.value = toMoney2(val);
  } catch (error) {
    console.error("Error getBalance:", error);
  } finally {
    isDisabled.value = false;
  }
};

const getTRXbalance = async () => {
  try {
    if (!address.value) return;
    const { data } = await axios.post("/api/tron/getAddressBalance", {
      address: address.value,
    });
    TRXbalance.value = Number(data?.balance ?? 0);
  } catch (error) {
    console.error("Error getTRXbalance:", error);
  }
};

// 안전 변환 유틸
function toMoney2(val, fallback = "0.00000000") {
  if (val === null || val === undefined) return fallback;
  const n = parseFloat(String(val));
  return Number.isFinite(n) ? n.toFixed(8) : fallback;
}

// 보낸 내역
const getSendHistory = async () => {
  try {
    const form = {
      user_srl: localStorage.getItem("user_srl"),
      user_id,
      coin_name: selectedCoin.value, // 'TRON' | 'LOTT'
      address: address.value,
      type: "withdraw",
    };
    const { data } = await axios.post("/api/tron/getAddressSendHistory", form);
    const history = [];
    if (data?.result === "success") {
      data.data.forEach((el) => {
        if (changeDate(el.create_at) !== create_date.value) {
          create_date.value = changeDate(el.create_at);
          el.departDate = true;
        } else {
          el.departDate = false;
        }
        el.amount = Number(el.amount).toFixed(8);
        el.usedFee = Number(el.usedFee).toFixed(8);
        history.push(el);
      });
    }
    sendHistoryData.value = history;
  } catch (error) {
    console.error("Error getSendHistory:", error);
  }
};

const changeDate = (datetime) => moment(datetime).tz("Asia/Seoul").format("YY.MM.DD");
const changeTime = (datetime) =>
  moment(datetime).tz("Asia/Seoul").format("MM월DD일 HH시mm분");

const Toast = async () => {
  try {
    const form = {
      user_srl: localStorage.getItem("user_srl"),
      user_id,
      from_address: address.value,
      to_address: to_address.value,
      token_name: selectedCoin.value, // 'TRON' or 'LOTT'
      amount: amount.value,
    };

    // Tron 수수료/에너지 추정
    const { data } = await axios.post("/api/tron/energytest", form); // ← tron.js 라우트
    const est = data?.estimated;
    if (!est) throw new Error("수수료/에너지 추정 결과가 없습니다.");

    const isTRX = (form.token_name || "").toUpperCase() === "TRON";
    const summaryLines = isTRX
      ? [
          `네트워크: Tron Mainnet`,
          `예상 대역폭: ~${est.estimatedBandwidth} bytes`,
          `보유 대역폭: ~${est.availableBandwidth} bytes`,
          est.bandwidthDeficit > 0
            ? `부족 대역폭: ${est.bandwidthDeficit} bytes`
            : `부족 대역폭: 없음`,
          `예상 TRX 비용: ~${Number(est.trxCost || 0).toFixed(6)} TRX`,
        ]
      : [
          `네트워크: Tron Mainnet`,
          `예상 에너지: ~${est.estimatedEnergy}`,
          `보유 에너지: ~${est.availableEnergy}`,
          est.energyDeficit > 0
            ? `부족 에너지: ${est.energyDeficit}`
            : `부족 에너지: 없음`,
          `예상 TRX 비용(에너지 대납): ~${Number(est.trxCost || 0).toFixed(6)} TRX`,
        ];

    estimated.value = Number(est.trxCost || 0).toFixed(6);

    const result = await Swal.fire({
      title: "코인을 전송하시겠습니까?",
      text: summaryLines.join("\n"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      await sendToken();
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

const sendToken = async () => {
  if (isDisabled.value) return;
  isDisabled.value = true;

  try {
    const RequestApi =
      selectedCoin.value === "TRON" ? "/api/tron/transfer" : "/api/tron/transferToken"; // ← tron.js 라우트

    const sendForm = {
      user_srl: localStorage.getItem("user_srl"),
      email: localStorage.getItem("user_email"),
      user_id,
      from_address: address.value,
      to_address: to_address.value,
      token_name: selectedCoin.value, // 'TRON' | 'LOTT'
      amount: amount.value,
    };

    await requestCheck(sendForm);

    const { data: sendResult } = await axios.post(RequestApi, sendForm);

    if (sendResult.result === "success") {
      Swal.fire({ title: "SENDING!", text: "코인이 전송되었습니다", icon: "success" });
      await Promise.all([getBalance(), getSendHistory(), getTRXbalance()]);
    } else if (sendResult.result === "block") {
      Swal.fire({
        title: "ERROR",
        text: sendResult.message || "잠겨있어 전송할 수 없습니다.",
        icon: "error",
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

onMounted(async () => {
  await getHaveCoin();
  await getAddress();
  await Promise.all([getBalance(), getSendHistory(), getTRXbalance()]);
});

const requestCheck = async (sendForm) => {
  if (
    !sendForm.user_id ||
    !sendForm.user_srl ||
    !sendForm.from_address ||
    !sendForm.to_address ||
    !sendForm.token_name ||
    !sendForm.amount ||
    parseFloat(sendForm.amount) <= 0
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
