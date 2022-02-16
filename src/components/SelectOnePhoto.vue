<template>
  <div id="wrapper">
    <!-- <v-btn @click="openExplorer()" elevation="2" :color="btnColor">
      {{ btnText }}
    </v-btn> -->
    <v-file-input
      show-size
      truncate-length="50"
      accept="image/*"
      label="Select an image"
      prepend-icon="mdi-file-image-outline"
      style="width: 25rem"
      @change="openExplorer"
    ></v-file-input>
  </div>
</template>

<script>
import { store } from "../store.js";

// const { dialog } = require("electron").remote;

export default {
  name: "select-photos-page",
  props: {
    btnColor: String,
    btnText: {
      type: String,
      default: "Select a photo",
    },
  },
  data: () => ({
    reader: new FileReader(),
    paths:
      store.state.lutPath != undefined && store.state.lutPath.length > 0
        ? store.state.lutPath
        : "",
  }),
  methods: {
    openExplorer(e) {
      console.log(e);
      console.log(URL.createObjectURL(e));

      // this.paths = dialog.showOpenDialog({
      //   title: "Select one photo",
      //   properties: ["openFile"],
      //   filters: [{ name: "Pictures", extensions: ["jpg", "png", "jpeg"] }],
      // });

      if (
        e.name.includes(".png") ||
        e.name.includes(".jpeg") ||
        e.name.includes(".jpg")
      ) {
        this.paths = this.paths == undefined ? "" : URL.createObjectURL(e);
        store.replaceLutPath(this.paths);
        this.$emit("imageAdd", this.paths);
      }
    },
  },
};
</script>

<style scoped>
.wrapper {
  width: 5rem !important;
  display: flex;
  justify-content: center;
}
</style>