<template>
  <TopBack back="/home"></TopBack>
  <!-- <div
    class="page__content page__content--with-header page__content--with-bottom-nav"
  ></div> -->
  <!-- <div
    class="d-flex justify-content-center align-items-center"
    :style="{ verticalAlign: 'middle' }"
  >
    <div style="width: 100%" id="reader"></div>
  </div> -->
  <div style="position: relative; width: 100%; height: 100%">
    <!-- 가려질 내용 -->
    <div id="content" class="d-flex justify-content-center align-items-center">
      <div
        style="width: 100%"
        id="reader"
        :style="{ border: 'none !important' }"
      ></div>
    </div>

    <!-- 가리는 div -->
    <div id="overray"></div>
  </div>
</template>

<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { onMounted, ref } from "vue";

onMounted(() => {
  setTimeout(() => {
    const overray = document.getElementById("overray");
    overray.style.display = "none"; // 이렇게 수정

    const reader = document.getElementById("reader");
    reader.style.border = "none"; //

    const dashboard_section = document.getElementById(
      "reader__dashboard_section_csr"
    );
    dashboard_section.style.display = "none"; //

    const dashboard = document.getElementById("reader__dashboard_section");
    dashboard.style.padding = 0; //
  }, 1000);
  function onScanSuccess(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    // console.log(`Scan decodedText:`, decodedText);
    console.log(`Scan result:`, decodedResult);
    document.location.href = decodedText;
  }
  function onScanfail(decodedText, decodedResult) {
    // Handle on success condition with the decoded text or result.
    // console.log(`Scan decodedText:`, decodedText);
    console.log(`Scan result: ${decodedText}`, decodedResult);
  }

  let width = ref(window.innerWidth);
  let height = ref(window.innerHeight);
  let box = ref(Number(width.value / 3) <= 250 ? 250 : Number(width.value / 3));
  let config = {
    fps: 10,
    qrbox: box.value,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
    // supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_FILE],
    aspectRatio: width.value / height.value,
  };

  var html5QrcodeScanner = new Html5QrcodeScanner("reader", config);
  html5QrcodeScanner.render(onScanSuccess, onScanfail);
});
</script>
<style>
#content {
  height: 100vh;
  vertical-align: middle;
}
#reader {
  background-color: "#0f0638";
}
#overray {
  float: right;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000000;
}

#html5-qrcode-button-camera-start,
#html5-qrcode-button-camera-stop {
  display: none;
}
#html5-qrcode-button-camera-permission {
  border-radius: 5px;
  background-color: #1f7ae5;
  box-shadow: 0px 0px 8px 2px #9f9f9fc7;
  width: 90%;
  padding: 10px;
  font-size: 14px;
  font-weight: bolder;
  color: white;
}
.html5-qrcode-element {
  color: black;
}
#qr-reader__scan_region {
  height: 80%;
}
#qr-shaded-region {
  border-width: 100px 50px;
}
#reader__scan_region {
  display: block;
  justify-items: center;
  align-items: center;
}
#reader__dashboard_section_csr {
  display: none;
}
#reader__dashboard_section {
  /* display: none; */
  /* padding: 0; */
}
</style>
