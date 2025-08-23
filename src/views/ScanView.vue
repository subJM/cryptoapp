<template>
  <TopBack back="/home" />
  <div id="scan-wrap">
    <div id="reader"></div>

    <!-- 필요하면 중앙 가이드 박스(선택) -->
    <!-- <div class="guide">
      <div class="box"></div>
    </div> -->
  </div>
</template>
<script setup>
import TopBack from "@/components/templates/inc/TopBack.vue";
import { Html5Qrcode } from "html5-qrcode";
import { onMounted, onBeforeUnmount } from "vue";

let qr;
let navigating = false;

function handleDecoded(text) {
  if (navigating) return;
  navigating = true;
  if (/^https?:\/\//i.test(text)) location.href = text;
  else console.log("decoded:", text);
}

async function pickBackCameraId() {
  // iOS 라벨 노출을 위해 1회 권한 워밍업(라벨이 비어 있는 기기 대응)
  try {
    const s = await navigator.mediaDevices.getUserMedia({ video: true });
    s.getTracks().forEach((t) => t.stop());
    // eslint-disable-next-line no-empty
  } catch (_) {}
  const cams = await Html5Qrcode.getCameras(); // [{id,label}, ...]
  if (!cams?.length) throw new Error("카메라를 찾을 수 없습니다.");
  const back = cams.find((c) => /back|rear|environment/i.test(c.label));
  return (back || cams[0]).id;
}

async function startScan() {
  if (!window.isSecureContext) {
    alert("카메라는 HTTPS/localhost에서만 동작합니다.");
    return;
  }
  // TopBar 높이만큼 스캔 영역을 아래로 내림
  const topH = document.getElementById("scan-topbar")?.offsetHeight || 0;
  document.documentElement.style.setProperty("--scan-top", topH + "px");

  const deviceId = await pickBackCameraId();

  qr = new Html5Qrcode("reader");
  await qr.start(
    { deviceId: { exact: deviceId } }, // ★ 후면만
    {
      fps: 12,
      // 화면 크기에 따라 정사각 QR 영역(기본 오버레이는 아래 CSS로 숨김)
      qrbox: (vw, vh) => {
        const size = Math.round(Math.min(vw, vh) * 0.6);
        return { width: size, height: size };
      },
      // aspectRatio는 강제하지 않아도 됨(컨테이너를 풀화면으로 고정)
    },
    handleDecoded,
    () => {}
  );
}

async function stopScan() {
  try {
    await qr?.stop();
    await qr?.clear();
    // eslint-disable-next-line no-empty
  } catch {}
}

onMounted(() => {
  startScan().catch((e) => alert(e.message || e));
});
onBeforeUnmount(() => {
  stopScan();
});
</script>

<style scoped>
/* 화면 꽉 채우기: 상단 TopBack 높이만큼 내려서 겹치지 않게 */
#scan-wrap {
  position: fixed;
  top: var(--scan-top, 0px);
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: calc(100dvh - var(--scan-top, 0px));
  background: #0f0638;
  overflow: hidden;
}

/* 라이브러리가 넣는 video를 진짜 풀화면로 */
#reader {
  position: absolute;
  inset: 0;
}
#reader video {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important; /* 여백 없이 꽉 채움 */
}

/* 라이브러리 기본 음영/모서리 박스 숨김(겹침 방지) */
#reader #qr-shaded-region {
  display: none !important;
}

/* 커스텀 중앙 가이드 (원하면 유지) */
.guide {
  pointer-events: none;
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}
.guide .box {
  width: min(60vw, 60vh);
  height: min(60vw, 60vh);
  border: 2px solid rgba(255, 255, 255, 0.9);
  border-radius: 14px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.28) inset; /* 바깥 음영 */
}
</style>
