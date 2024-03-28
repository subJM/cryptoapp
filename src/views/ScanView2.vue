<template>
  <TopBack back="/home"></TopBack>
  <!-- <div
    class="page__content page__content--with-header page__content--with-bottom-nav align-content-center d-flex align-items-center"
    > -->
  <div
    :style="{
      width: '100%',
      height: '400px',
    }"
  >
    <qrcode-stream @detect="onDetect"></qrcode-stream>
  </div>
  <div
    class="d-flex justify-items-center align-items-center"
    :style="{ height: '100vh' }"
  ></div>
  <div style="height: 500px">
    <div
      id="qr-reader"
      :style="{
        width: '100%',
        verticalAlign: 'middle',
      }"
    ></div>
  </div>
  <div id="qr-reader-results"></div>
</template>

<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import { Html5QrcodeScanner } from "html5-qrcode";
import { onMounted } from "vue";

onMounted(() => {
  const qrScanner = new Html5QrcodeScanner(
    "qr-reader",
    { fps: 60, qrbox: 170 },
    /* verbose= */ false
  );
  const onScanSuccess = (decodedText) => {
    // 스캔 성공 시 로직
    console.log("decodedText : ", decodedText);
    qrScanner.clear();
    // 예: 스캔 결과를 화면에 표시
    window.location.href = decodedText;
  };

  qrScanner.render(onScanSuccess);
});
</script>
<style>
#qr-reader {
  background-color: "#0f0638";
  border: "none";
}

#html5-qrcode-button-camera-start,
#html5-qrcode-button-camera-stop,
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
  display: flex;
  justify-items: center;
  align-items: center;
}
</style>
