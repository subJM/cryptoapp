<template>
  <TopBack back="/home"></TopBack>

  <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  >
    <div>
      <img
        src="/images/logos/ETH.png"
        alt=""
        srcset=""
        :style="{
          width: '200px',
        }"
      />
    </div>
    <div class="fieldset">
      <div class="form">
        <form id="Form" method="post" action="checkout.html">
          <div class="form__row">
            <div class="form__select">
              <span
                :style="{
                  display: 'flex',
                  fontSize: '1.3rem',
                  fontWeight: '400',
                }"
                >코인 선택
              </span>
              <select
                v-model="select_coin"
                id="select_coin"
                name="select_coin"
                class="required text-center"
              >
                <option value="ETH" selected>Ethereum (ETH)</option>
                <option value="LOTT" :disabled="true">LOTT (LOTT)</option>
                <!-- <option value="ETH">ETH (Ethereum)</option>
                <option value="BTC">BTC (Bitcoin)</option> -->
              </select>
            </div>
          </div>
          <div class="form__row">
            <div class="form__select">
              <span
                :style="{
                  display: 'flex',
                  fontSize: '1.3rem',
                  fontWeight: '400',
                }"
                >스테이킹 타입
              </span>
              <select
                v-model="stakingType"
                id="select_coin"
                name="select_coin"
                class="required text-center"
              >
                <option value="ENERGY" selected>ENERGY</option>
                <option value="BANDWIDTH" selected>BANDWIDTH</option>
                <!-- <option value="ETH">ETH (Ethereum)</option>
                <option value="BTC">BTC (Bitcoin)</option> -->
              </select>
            </div>
          </div>
          <!-- <div class="form__row">
            <div>
              <span
                :style="{
                  display: 'flex',
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
          </div> -->
          <div class="form__row">
            <span
              :style="{
                display: 'flex',
                fontSize: '1.3rem',
                fontWeight: '400',
              }"
              >수량
            </span>
            <input
              type="number"
              name="Text"
              value=""
              class="form__input text-end amount"
              placeholder="수량을 입력해주세요"
              autocomplete="off"
              v-model="amount"
            />
          </div>
        </form>
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
            Staking
          </button>
        </div>
      </div>
    </div>
    <div class="fieldset text-start" style="">
      <div>
        * 스테이킹은 언제든 해제가 가능하며
        <span :style="{ color: '#b8ff6d' }">단, 해제후 2일후에 이용이 가능</span
        >합니다.
      </div>
      <div class="mt-4">
        * 스테이킹은 타입 <span :style="{ color: '#b8ff6d' }">ENERGY</span> 는
        <span :style="{ color: 'red' }">EVC</span> 토큰을 사용시
        <span :style="{ color: '#b8ff6d' }"
          >스마트 컨트랙트 실행 비용을 충당</span
        >하는 데 사용됩니다
      </div>
      <div class="mt-4">
        * 스테이킹은 타입
        <span :style="{ color: '#b8ff6d' }">BANDWIDTH</span> 는
        <span :style="{ color: 'red' }">TRX</span> 토큰을 사용시
        <span :style="{ color: '#b8ff6d' }"
          >트랜잭션 데이터 전송 비용을 충당</span
        >하는 데 사용됩니다
      </div>
      <div class="mt-4">
        <h4>결론</h4>
        <div>
          1. 리소스를 최적화 하려면
          <span :style="{ color: '#b8ff6d' }"> BANDWIDTH</span>와
          <span :style="{ color: '#b8ff6d' }">ENERGY</span>를 모두 적절히
          확보하여 TRX 수수료를 최소화하세요.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import axios from "axios";
import Swal from "sweetalert2";

import { ref } from "vue";
const select_coin = ref("ETH");
const stakingType = ref("ENERGY");
const amount = ref(0);
const tron_address = localStorage.getItem("tron_address");
const isDisabled = ref(true);

const Toast = () => {
  Swal.fire({
    title: "스테이킹 하시겠습니까?",
    text: "스테이킹 금액 :" + amount.value + " " + select_coin.value,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "확인",
  }).then(async (result) => {
    if (result.isConfirmed) {
      // sendToken을 호출할 때 익명 함수로 감싸기
      try {
        sendForm();
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "코인 전송에 실패했습니다.",
          icon: "error",
        });
      }
    }
  });
};

const sendForm = async () => {
  if (amount.value < 0) {
    return;
  }
  const form = {
    user_id: localStorage.getItem("user_id"),
    stakingType: stakingType.value,
    amount: amount.value,
    tron_address: tron_address,
  };
  var response = await axios.post("http://localhost:3000/lott/staking", form);
  console.log(response);
  if (response == "success") {
    window.location.reload();
  }
};
</script>
<style>
option {
  background-color: #0f0638;
}
</style>
