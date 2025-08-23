<template>
  <div style="max-width: 480px; margin: 0 auto">
    <div
      id="reader"
      style="
        width: 100%;
        min-height: 320px;
        background: #0f0638;
        border-radius: 12px;
      "
    ></div>
    <select
      v-if="cameras.length"
      v-model="selectedId"
      @change="restart"
      style="width: 100%; margin-top: 8px"
    >
      <option v-for="c in cameras" :key="c.id" :value="c.id">
        {{ c.label || "Camera " + c.id.slice(-4) }}
      </option>
    </select>
    <button @click="start" style="margin-top: 8px">카메라 시작</button>
    <p style="white-space: pre-line; margin-top: 8px">{{ status }}</p>
  </div>
</template>

<script setup>
import { Html5Qrcode } from "html5-qrcode";
import { ref, onBeforeUnmount } from "vue";

const status = ref("ready");
const cameras = ref([]);
const selectedId = ref("");
let qr;

async function warmupPermission() {
  // iOS Safari는 한 번 권한을 열어야 장치 라벨/목록이 나오는 경우가 많습니다.
  const s = await navigator.mediaDevices.getUserMedia({ video: true });
  s.getTracks().forEach((t) => t.stop());
}

async function listCameras() {
  const list = await Html5Qrcode.getCameras(); // [{id,label},...]
  cameras.value = list;
  const back =
    list.find((d) => /back|rear|environment/i.test(d.label)) || list[0];
  selectedId.value = back?.id || "";
}

async function start() {
  try {
    status.value = `secure=${window.isSecureContext}`;
    if (!navigator.mediaDevices?.getUserMedia) {
      status.value += "\ngetUserMedia unsupported";
      return;
    }
    // 사용자 제스처 안에서 권한 워밍업 → 장치 목록
    await warmupPermission();
    await listCameras();

    await startWith(
      selectedId.value || { facingMode: { ideal: "environment" } }
    );
    status.value += "\ncamera started";
  } catch (e) {
    // 후면 실패 시 전면 폴백
    try {
      await startWith({ facingMode: { ideal: "user" } });
      status.value += "\nback failed, using front camera";
    } catch (e2) {
      status.value = "start failed: " + (e2?.message || e2);
    }
  }
}

async function startWith(cameraIdOrConfig) {
  if (qr) {
    try {
      await qr.stop();
      await qr.clear();
    } catch {
      console.log("start");
    }
  }
  qr = new Html5Qrcode("reader");
  await qr.start(
    cameraIdOrConfig,
    { fps: 10, qrbox: 250, rememberLastUsedCamera: true },
    (text) => {
      status.value = "decoded: " + text;
      if (/^https?:\/\//i.test(text)) location.href = text;
    },
    () => {} // scan failure 콜백은 빈 처리
  );
}

async function restart() {
  try {
    await startWith(selectedId.value);
  } catch (e) {
    status.value = "restart failed: " + (e?.message || e);
  }
}

onBeforeUnmount(async () => {
  try {
    await qr?.stop();
    await qr?.clear();
  } catch {
    console.log("start");
  }
});
</script>
