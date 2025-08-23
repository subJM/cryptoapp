<template>
  <TopBack id="scan-topbar" back="/home" />
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

// 스캔 화면 높이를 '보이는 영역'에 정확히 맞춤
function setScanViewport(ratio = 1) {
  // ratio: 0.7 이면 화면의 70%만 카메라
  const topH = document.getElementById("scan-topbar")?.offsetHeight || 0;
  const vh = window.visualViewport?.height || window.innerHeight;
  const scanH = vh - topH;
  document.documentElement.style.setProperty("--scan-top", topH + "px");
  document.documentElement.style.setProperty("--scan-h", scanH + "px");
  document.documentElement.style.setProperty(
    "--reader-h",
    Math.round(scanH * ratio) + "px"
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
  setScanViewport(0.85);
  // 주소창이 숨거나 회전될 때도 즉시 반영
  const upd = () => setScanViewport(0.85);
  window.visualViewport?.addEventListener("resize", upd, { passive: true });
  window.addEventListener("resize", upd, { passive: true });
  window.addEventListener("orientationchange", () => setTimeout(upd, 100));
  startScan().catch((e) => alert(e.message || e));
});
onBeforeUnmount(() => {
  stopScan();
  window.visualViewport?.removeEventListener("resize", setScanViewport);
  window.removeEventListener("orientationchange", setScanViewport);
});
</script>

<style scoped>
/* TopBack이 있다면 id="scan-topbar" 지정(이미 쓰셨다면 OK) */
/* 스캔 영역: 위는 TopBack 만큼 내리고, 아래는 화면 끝까지 */
#scan-wrap {
  position: fixed;
  top: var(--scan-top, 0px);
  left: 0;
  right: 0;
  height: var(--scan-h, 100svh); /* 동적 높이(없으면 100svh) */
  background: #0f0638;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
}

/* html5-qrcode가 만드는 래퍼/비디오/캔버스 전부 100% 강제 */
#reader {
  position: absolute;
  inset: 0;
  height: var(--reader-h, var(--scan-h));
}
#reader > div,
#reader > div > div,
#reader video,
#reader canvas {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important; /* 레터박스 방지 */
}

/* 라이브러리 기본 음영은 숨기고(겹침 방지), 우리 가이드만 보여주기 */
#reader #qr-shaded-region {
  display: none !important;
}

/* 선택: 가운데 가이드 유지 중이라면 */
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
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.28) inset;
}

/* (선택) 아래 여유영역을 패널로 쓸 때 */
.bottom-panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(var(--scan-h) - var(--reader-h, var(--scan-h)));
}
</style>
