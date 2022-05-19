<template>
  <router-view/>
</template>

<style lang="scss">
body {
  background-color: #303941;
}

.fade-enter-active,
.fade-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;

}

//.fade-enter-to,
//.fade-leave-from {
//  //opacity: 0;
//
//}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: rotateX(30deg);
}
</style>
