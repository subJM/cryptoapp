<template>
  <div>
    <video ref="webcamVideo" autoplay></video>
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
  },
};
</script>
