<template>
  <TopBack back="/home" />
  <div class="wrap">
    <div id="reader"></div>
  </div>
</template>

<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { onMounted, onBeforeUnmount } from "vue";

let scanner;

function onScanSuccess(decodedText /*, decodedResult */) {
  if (/^https?:\/\//i.test(decodedText)) {
    location.href = decodedText;
  } else {
    console.log("decoded:", decodedText);
  }
}
function onScanFailure() {
  /* 너무 자주 호출되므로 로그 생략 */
}

onMounted(() => {
  if (!window.isSecureContext) {
    alert("카메라는 HTTPS/localhost에서만 동작합니다.");
    return;
  }
  // Scanner UI 사용(버튼/카메라 선택 포함)
  scanner = new Html5QrcodeScanner("reader", {
    fps: 10,
    qrbox: 250, // 또는 { width: 250, height: 250 }
    rememberLastUsedCamera: true,
    showTorchButtonIfSupported: true,
    showZoomSliderIfSupported: true,
    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
  });
  scanner.render(onScanSuccess, onScanFailure);
});

onBeforeUnmount(async () => {
  try {
    await scanner?.clear();
    // eslint-disable-next-line no-empty
  } catch {}
});
</script>

<style scoped>
.wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
}
#reader {
  width: 100%;
  max-width: 480px;
  background-color: #0f0638;
  border-radius: 12px;
}
/* ❌ 시작/정지/대시보드/스캔영역을 숨기는 CSS는 넣지 마세요 */
</style>
