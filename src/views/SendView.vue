<template>
  <TopBackVue back="/home"></TopBackVue>
  <!-- PAGE CONTENT -->
  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
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
                <option value="ETH" selected>ETH (Ethereum)</option>
                <option value="BTC">BTC (Bitcoin)</option>
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
              <span class="p-0">{{ selectedCoin }} :</span>
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

          <div class="form__coin-total">$ 2,465.00</div>
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
        </div>
      </div>
    </div>
    <div class="d-grid gap-2">
      <button
        type="submit"
        :style="{
          height: '50px',
          fontSize: '16px',
          backgroundColor: 'rgb(205 191 221);',
          borderRadius: '25px',
        }"
        :disabled="isDisabled"
        @click.prevent="sendToken"
      >
        Send Token
      </button>
    </div>
  </div>
</template>

<script setup>
import TopBackVue from "@/components/templates/inc/TopBack.vue";

import axios from "axios";
import { onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

console.log(route.params.address);

const address = ref("");
const balance = ref("");
const to_address = ref(route.params.address);
const amount = ref("0");
const token_name = ref(route.params.coinName);
const isDisabled = ref(false);

const selectedCoin = ref("ETH");
const icon_url = ref(`/images/logos/${selectedCoin.value}.png`);

let tokenList = [];
let isToken = true;

// 두번 클릭 방지
let isClicked = false;

async function handleClick() {
  if (isClicked) return; // Ignore clicks if already clicked
  isClicked = true;

  // Handle click action here

  setTimeout(() => {
    isClicked = false; // Re-enable clicking after 500ms
  }, 1000);
}

const sendToken = async () => {
  try {
    console.log("sendtoken");
    await handleClick();
    // var RequestApi = "http://localhost:3000/token/sendETH";
    // if (token_name.value != "ETH") {
    //   RequestApi = "http://localhost:3000/token/sendToken";
    // }
    var RequestApi = "http://localhost:3000/token/test2";

    const sendForm = {
      user_srl: localStorage.getItem("user_srl"),
      user_id: user_id,
      from_address: address.value,
      to_address: to_address.value,
      token_name: token_name.value,
      amount: amount.value,
    };
    requestCheck(sendForm);
    var response = await axios.post(RequestApi, sendForm);
    var sendResult = response.data;
    if (sendResult.result == "success") {
      // router.push("/home");
      window.location.reload();
    }
  } catch (error) {
    console.log("error: " + error);
  }
};

watch(selectedCoin, (newSelectedCoin) => {
  icon_url.value = `/images/logos/${newSelectedCoin}.png`;
  if (newSelectedCoin != "ETH") {
    isToken = false;
  } else {
    isToken = true;
  }
});
watch(token_name, () => {
  if (selectedCoin.value == "ETH") {
    getAddress().then(async () => {
      getBalance();
    });
  }
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
        "http://localhost:3000/users/getAddress",
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

    var res = await axios.post(
      "http://localhost:3000/token/getTokenList",
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
    let form = {};
    let url = "";
    isDisabled.value = true;
    if (selectedCoin.value == "ETH") {
      if (token_name.value == "ETH") {
        form = { address: address.value };
        url = "http://localhost:3000/users/getAddressBalance";
      } else {
        form = {
          token_name: token_name.value,
          address: address.value,
        };
        url = "http://localhost:3000/token/getBalance";
      }
    }
    var response = await axios.post(url, form);
    balance.value = response.data.balance;
    isDisabled.value = false;
  } catch (error) {
    console.error("Error fetching the address:", error);
  }
};

onMounted(() => {
  getAddress().then(async () => {
    getBalance();
  });

  getHaveCoin();
});

const requestCheck = (sendForm) => {
  if (
    sendForm.user_id === "" ||
    sendForm.from_address === "" ||
    sendForm.to_address === "" ||
    sendForm.token_name === "" ||
    sendForm.amount === ""
  ) {
    throw "Please fill in the empty space";
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
useRoute, useRoute,
