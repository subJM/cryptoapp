<template>
  <div class="" :style="{ height: '100%' }">
    <video :style="{ width: '100%' }" ref="webcamVideo" autoplay></video>
    <canvas ref="canvas" :style="{ display: 'none' }"></canvas>
    <button @click="takeSnapshot">스냅샷 촬영</button>
  </div>
</template>
<script>
export default {
  mounted() {
    this.initializeWebcam();
  },
  methods: {
    async initializeWebcam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        this.$refs.webcamVideo.srcObject = stream;
      } catch (error) {
        console.error("웹캠 접근 오류:", error);
      }
    },
    takeSnapshot() {
      const video = this.$refs.webcamVideo;
      const canvas = this.$refs.canvas;
      const context = canvas.getContext("2d");

      // canvas의 크기를 비디오 스트림과 일치시킵니다.
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 비디오의 현재 프레임을 canvas에 그립니다.
      context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      console.log("test");
      // 캡처된 이미지를 다루기 위한 코드를 여기에 추가합니다.
      // 예: canvas.toDataURL('image/png')를 사용하여 이미지를 Base64 형식으로 추출할 수 있습니다.
      // 스냅샷을 Base64 인코딩된 이미지로 변환
      const imageDataUrl = canvas.toDataURL("image/png");

      // 이미지 데이터를 활용하는 로직 (예: 화면에 표시, 서버로 전송 등)
      console.log(imageDataUrl); // 콘솔에 Base64 인코딩된 이미지 데이터 출력
      // 다운로드 링크 생성 및 클릭
      const downloadLink = document.createElement("a");
      downloadLink.href = imageDataUrl; // 이미지 데이터 URL 할당
      downloadLink.download = "snapshot.png"; // 다운로드될 파일명 설정

      // 링크를 문서에 추가하고 클릭 이벤트 발생
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // 사용 후 링크 제거
      document.body.removeChild(downloadLink);
    },
  },
};
</script>
