<template>
  <TopBack back="/home" />
  <div id="scan-wrap">
    <div id="reader"></div>

    <!-- 필요하면 중앙 가이드 박스(선택) -->
    <div class="guide">
      <div class="box"></div>
    </div>
  </div>
</template>

<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import { Html5Qrcode } from "html5-qrcode";
import { onMounted, onBeforeUnmount } from "vue";

let qr; // Html5Qrcode 인스턴스
let navigating = false;

function handleDecoded(text) {
  if (navigating) return; // 중복 이동 방지
  navigating = true;
  if (/^https?:\/\//i.test(text)) {
    location.href = text;
  } else {
    // 링크가 아니면 필요한 처리
    console.log("decoded:", text);
  }
}

async function pickBackCameraId() {
  // iOS는 라벨이 비어 있을 수 있으므로 한 번 권한 워밍업(라벨 표시 목적)
  try {
    const s = await navigator.mediaDevices.getUserMedia({ video: true });
    s.getTracks().forEach((t) => t.stop());
    // eslint-disable-next-line no-empty
  } catch (_) {}

  const cams = await Html5Qrcode.getCameras(); // [{id,label}, ...]
  if (!cams?.length) throw new Error("카메라를 찾을 수 없습니다.");

  // 라벨에 back/rear/environment 포함된 장치를 우선
  const back = cams.find((c) => /back|rear|environment/i.test(c.label));
  return (back || cams[0]).id;
}

async function startScan() {
  if (!window.isSecureContext) {
    alert("카메라는 HTTPS/localhost에서만 동작합니다.");
    return;
  }
  const deviceId = await pickBackCameraId();

  qr = new Html5Qrcode("reader");
  // 풀화면 + 후면카메라 지정, 줌 UI 없음(엔진만 사용하므로)
  await qr.start(
    { deviceId: { exact: deviceId } },
    {
      fps: 12,
      // 화면 크기에 따라 동적으로 qrbox 크기 계산(화면 60%)
      qrbox: (vw, vh) => {
        const size = Math.round(Math.min(vw, vh) * 0.6);
        return { width: size, height: size };
      },
      aspectRatio: 9 / 16, // 세로 화면 비율(원하는 비율로 조정 가능)
      // disableFlip: true, // 필요 시 좌우반전 금지
    },
    handleDecoded,
    () => {} // 실패 콜백은 과도하게 많으므로 생략
  );
}

async function stopScan() {
  try {
    await qr?.stop();
    await qr?.clear();
    // eslint-disable-next-line no-empty
  } catch {}
}

// 스캔 영역 높이를 보이는 창 크기에 딱 맞추기
function setScanViewport() {
  const vh = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty("--scan-h", vh + "px");
}

onMounted(() => {
  setScanViewport();
  const vv = window.visualViewport;
  vv?.addEventListener("resize", setScanViewport, { passive: true });
  window.addEventListener("resize", setScanViewport, { passive: true });
  window.addEventListener("orientationchange", () =>
    setTimeout(setScanViewport, 100)
  );
  startScan().catch((e) => alert(e.message || e));
});
onBeforeUnmount(() => {
  stopScan();
  const vv = window.visualViewport;
  vv?.removeEventListener("resize", setScanViewport);
  window.removeEventListener("resize", setScanViewport);
  window.removeEventListener("orientationchange", setScanViewport);
});
</script>

<style scoped>
/* 화면 꽉 채우기 (모바일 주소창 변화 대응: 100dvh) */
#scan-wrap {
  position: relative;
  width: 100vw;
  height: 100dvh;
  background: #0f0638;
  overflow: hidden;
}

/* 라이브러리가 넣는 <video>를 꽉 채우기 */
#reader {
  position: absolute;
  inset: 0;
}
#reader video {
  position: absolute;
  inset: 0;
  /* width: 100%; */
  height: 100%;
  object-fit: cover; /* 여백 없이 꽉 채우기 */
}

/* 중앙 가이드(선택) */
/* .guide {
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.guide .box {
  width: min(60vw, 60vh);
  height: min(60vw, 60vh);
  border: 2px solid rgba(255, 255, 255, 0.75);
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.25) inset;
} */

/* 기존 오버레이/숨김 CSS 필요 없음 */
</style>
