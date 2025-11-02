<template>
  <TopBack back="/home"></TopBack>
  <div
    class="d-flex justify-content-center align-items-center"
    :style="{ height: '100%' }"
  >
    <div :style="{ padding: '20px' }">
      <div>
        <!-- :value="`http://evc-w.io/send/${coin_name}/${tron_address}`" -->
        <!-- :value="`${eth_address}`" -->
        <vue-qrcode
          :value="`https://lottwallet.org/send/${coin_name}/${tron_address}`"
          :scale="8"
          :style="{ width: '100%' }"
        />
      </div>

      <div class="form-floating mb-4 mt-4">
        <input
          type="text"
          class="form-control"
          id="textToCopy"
          :value="eth_address"
          placeholder=""
          :style="{ height: '50px' }"
          ref="textToCopy"
          readonly
        />
        <label for="floatingInput">LOTT address</label>
      </div>
      <div>
        <div class="btn-copy" @click="copy">주소 복사</div>
      </div>
    </div>
  </div>
</template>
<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import Swal from "sweetalert2";
import { ref, onMounted } from "vue";
// import axios from "axios";
// or via CommonJS

import VueQrcode from "vue-qrcode";

// const coin_name = ref("LOTT");
const eth_address = ref(localStorage.getItem("eth_address"));

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  width: "150px",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  //   didOpen: (toast) => {
  //     toast.onmouseenter = swal.stopTimer;
  //     toast.onmouseleave = swal.resumeTimer;
  //   },
});

const copy = async () => {
  try {
    const address = document.getElementById("textToCopy").value;
    await navigator.clipboard.writeText(address);
    Toast.fire({
      icon: "success",
      title: "Copy successfully",
    });
  } catch (error) {
    console.log(error);
    Toast.fire({
      icon: "error",
      title: "Copy Error",
    });
  }
};

onMounted(() => {
  // recreate_account();
});

// const recreate_account = async () => {
//   console.log(eth_address.value);
//   if (eth_address.value == "" || eth_address.value == undefined) {
//     const form = {
//       user_id: localStorage.getItem("user_id"),
//       user_srl: localStorage.getItem("user_srl"),
//     };
//     var response = await axios.post(
//       "/api/tron/recreate/account",
//       form
//     );
//     var res = response.data;
//     if (res.result == "success") {
//       localStorage.setItem("eth_address", res.address);
//       eth_address.value = res.address;
//       console.log(res.address);
//       window.location.reload();
//     }
//   }
// };
</script>

<style scope>
.btn-copy {
  background-color: mediumslateblue;
  border-radius: 5px;
  padding: 10px;
  font-size: 16px;
  font-weight: bolder;
}
video {
  height: 90%;
}
</style>
