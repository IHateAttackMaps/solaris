<template>
  <div id="parallax" ref="parallax"></div>
</template>

<script>
export default {
    mounted () {
        document.addEventListener("mousemove", this.parallax)
    },
    unmounted () {
        document.removeEventListener("mousemove", this.parallax)
    },
    methods: {
        parallax (e) {
            const elem = this.$refs.parallax
            let _w = window.innerWidth/2
            let _h = window.innerHeight/2
            let _mouseX = e.clientX
            let _mouseY = e.clientY
            let _depth1 = `${50 - (_mouseX - _w) * 0.001}% ${50 - (_mouseY - _h) * 0.001}%`
            let _depth2 = `${50 - (_mouseX - _w) * 0.002}% ${50 - (_mouseY - _h) * 0.002}%`
            let _depth3 = `${50 - (_mouseX - _w) * 0.003}% ${50 - (_mouseY - _h) * 0.003}%`
            let x = `${_depth3}, ${_depth2}, ${_depth1}`
            elem.style.backgroundPosition = x
        }
    }
}
</script>

<style scoped>
#parallax {
  position: absolute;
  left: 0;
  top: 40%;
  width: 100%;
  height: 60%;
  background-color: black;
  background-image: url(../../assets/parallax/layer3.png), url(../../assets/parallax/layer2.png), url(../../assets/parallax/layer1.png);
  background-repeat: no-repeat;
  background-position: center;
  background-position: 50% 50%;
  z-index: -1;
}
</style>
