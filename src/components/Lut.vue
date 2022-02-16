<template>
  <div class="lut">
    <Loading :loading="loading" />
    <div class="topElements">
      <h1>Manage LUTs</h1>
      <div>
        <v-btn
          @click="$vuetify.theme.dark = !$vuetify.theme.dark"
          icon
          tile
          x-large
        >
          <v-icon>mdi-brightness-6</v-icon>
        </v-btn>
        <!-- DIALOG -->
        <v-dialog v-model="infoDialog" width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn text icon x-large v-bind="attrs" v-on="on">
              <v-icon>mdi-information</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>Info</v-card-title>
            <v-card-text>
              This page can help you test some LUTs right from TheGordinho/MLUT
              repository. <br /><br />
              Please take note that it is for testing purpose, but saving the
              LUTed shot is still possible. The quality might be downgraded so
              don't trust this too much. <br /><br />
              It is advised to use a low resolution image for better
              performance. The other factor is the LUT downloading (20mb for
              some heavy LUTs), the first time it'll be long depending your
              connection speed, but then it comes from the cache. <br /><br />
              One last thing, this is not really stable, sometimes you might get
              a dark image, or even rainbowized. If it happens, you can just try
              again and it might work.
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
    </div>
    <!-- AUTOCOMPLETE ALL LUTS -->
    <v-autocomplete
      v-if="image"
      v-model="selectedLutList"
      :items="lutList"
      item-text="title"
      item-value="link"
      label="Select a LUT"
      @change="
        loading = $refs.img ? true : false;
        getLutData();
      "
      return-object
      filled
      rounded
    ></v-autocomplete>
    <!-- AUTOCOMPLETES LUT LIST -->
    <v-scroll-y-transition mode="in-out">
      <v-autocomplete
        v-if="lutData.tileSize != undefined && selectedLutList != ''"
        v-model="selectedLut"
        :items="lutData.luts"
        label="Select a LUT"
        @change="
          loading = $refs.img ? true : false;
          applyLUT();
        "
        filled
        rounded
      ></v-autocomplete>
    </v-scroll-y-transition>
    <!-- SLIDER -->
    <v-slider
      v-if="luttedImage != ''"
      v-model="lutIntensity"
      thumb-label
      color="pink"
      max="100"
      @change="applyLUT()"
    ></v-slider>
    <!-- SIDE BY SIDE IMAGES -->
    <div class="flex">
      <img
        v-if="selectedLutList.lutImgSrc != undefined"
        :src="`https://raw.githubusercontent.com${selectedLutList.lutImgSrc}`"
        alt="lut"
        ref="lut"
        @load="applyLUT()"
        crossorigin="Anonymous"
        hidden
      />
      <img
        v-if="image"
        id="img"
        :src="image"
        class="sideBySideImg"
        alt=""
        ref="img"
      />
      <div v-else class="selectPhotoBtn">
        <SelectOnePhoto @imageAdd="addImage($event)" btnColor="pink" />
      </div>
      <!-- src="file://C:\Users\Fratu\Pictures\2b.png" -->
      <img
        v-if="luttedImage != '' && !hideLutted"
        :src="luttedImage"
        alt=""
        class="sideBySideImg"
      />
      <canvas
        v-if="$refs.img != undefined"
        id="imageCanvas"
        :width="$refs.img.naturalWidth"
        :height="$refs.img.naturalHeight"
        hidden
      >
        Your browser does not support the HTML5 canvas tag.</canvas
      >
      <canvas id="lutCanvas" width="4096" height="128" hidden>
        Your browser does not support the HTML5 canvas tag.</canvas
      ><br />
    </div>
    <!-- BOTTOM BUTTONS -->
    <!-- <v-row v-if="luttedImage != ''">
      <SelectOnePhoto
        @imageAdd="addImage($event, true)"
        btnColor="pink"
        btnText="Select another photo"
      />
    </v-row> -->
  </div>
</template>

<script>
import { store } from "../store.js";
// const { dialog } = require("electron").remote;
// const { ipcRenderer } = require("electron");
// import applyLut from "../workers/applyLut";
// const fs = require("fs");
import Loading from "./Loading.vue";
import SelectOnePhoto from "./SelectOnePhoto.vue";

export default {
  data: () => ({
    state: store.state,
    lutData: {},
    selectedLut: 0,
    lutList: [],
    selectedLutList: "",
    luttedImage: "",
    hideLutted: false,
    lutIntensity: 100,
    loading: false,
    infoDialog: false,
    image: store.state.lutPath != undefined ? store.state.lutPath : "",
    header: {
      headers: {
        // "Access-Control-Allow-Methods": "GET, POST",
        // "Content-type": "text/plain"
        // 'Accept': 'text/html'
        // "Content-Type": "text/html",
        // mode: 'cors',
        // "Access-Control-Allow-Origin": "http://localhost:8080/",
      },
    },
  }),
  computed: {
    imageCanvas() {
      return document.getElementById("imageCanvas");
    },
    imageContext() {
      return document.getElementById("imageCanvas").getContext("2d");
    },
    lutContext() {
      return document.getElementById("lutCanvas").getContext("2d");
    },
  },
  mounted() {
    this.getLUTsList();
  },
  methods: {
    getLUTsList() {
      // https://api.github.com/repos/TheGordinho/MLUT
      this.$http
        .get(
          "https://api.github.com/repos/TheGordinho/MLUT/git/trees/dcb832a482d7fd220710d0bd9e1959a88c55ffe6"
        )
        .then((response) => {
          const data = response.data.tree;
          // let regex = /title="(.*?)".*data-pjax.*href="(.*?)"/g;
          // let m;
          // while ((m = regex.exec(response.data)) !== null) {
          //   if (m.index === regex.lastIndex) {
          //     regex.lastIndex++;
          //   }
          //   if (m[1] != "_BaseLUT.fxh") {
          data.map((item) => {
            const lutFx = "/TheGordinho/MLUT/master/Shaders/" + item.path;
            const lutImg =
              "/TheGordinho/MLUT/master/Textures/" +
              item.path.replace(".fx", ".png");
            this.lutList.push({
              title: item.path,
              link: lutFx,
              lutImgSrc: lutImg,
            });
          });
          //   }
          // }
        });
    },
    getLutData() {
      if (
        this.selectedLutList == undefined ||
        this.selectedLutList.link == undefined
      )
        return;
      this.$http
        .get("https://raw.githubusercontent.com" + this.selectedLutList.link)
        .then((response) => {
          let regex =
            /fLUT_LutList "(.*?)"[\s\S]*fLUT_TileSizeXY (.*?)\n[\s\S]*fLUT_TileAmount (.*?)\n[\s\S]*fLUT_LutAmount (.*?)\n/g;
          let m;
          while ((m = regex.exec(response.data)) !== null) {
            if (m.index === regex.lastIndex) {
              regex.lastIndex++;
            }
            this.lutData = {
              luts: [],
              tileSize: m[2],
              tileAmount: m[3],
              lutAmount: m[4],
            };
            const lutsNames = m[1].split("\\0");
            lutsNames.pop();
            lutsNames.map((item, i) => {
              this.lutData.luts.push({ text: item, value: i });
            });
          }
        });
    },
    applyLUT() {
      const image = this.$refs.img;
      const lut = this.$refs.lut;
      if (lut == undefined || image == undefined) return;
      var imageData, lutData, iData, lData;
      let tileSize = this.lutData.tileSize;
      let tileAmount = this.lutData.tileAmount;
      if (
        this.selectedLut > this.lutData.lutAmount ||
        this.selectedLut == undefined
      )
        this.selectedLut = 0;
      let currentLut = tileSize * this.selectedLut;

      this.imageContext.clearRect(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      // this.imageContext.scale(0.1, 0.1);
      this.imageContext.drawImage(image, 0, 0);
      imageData = this.imageContext.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      this.lutContext.clearRect(0, 0, lut.naturalWidth, lut.naturalHeight);
      this.lutContext.drawImage(
        lut,
        0,
        currentLut,
        lut.naturalWidth,
        tileSize,
        0,
        0,
        lut.naturalWidth,
        tileSize
      );
      lutData = this.lutContext.getImageData(
        0,
        0,
        lut.naturalWidth,
        lut.naturalHeight
      );
      iData = imageData.data;
      lData = lutData.data;

      let coeff = (255 / tileSize).toFixed(0);
      const lutWidth = lut.naturalWidth;
      const lutIntsty = this.lutIntensity;

      for (var i = 0, l = iData.length; i < l; i += 4) {
        let r, g, b;

        r = Math.floor(iData[i] / coeff);
        g = Math.floor(iData[i + 1] / coeff);
        b = Math.floor(iData[i + 2] / coeff);

        let lutX, lutY, lutIndex;

        lutX = (b % tileSize) * tileSize + r;
        lutY = Math.floor(b / tileAmount) * tileAmount + g;
        lutIndex = (lutY * lutWidth + lutX) * 4;

        let lutR, lutG, lutB;

        lutR = lData[lutIndex];
        lutG = lData[lutIndex + 1];
        lutB = lData[lutIndex + 2];

        iData[i] = this.lerp(iData[i], lutR, lutIntsty / 100);
        iData[i + 1] = this.lerp(iData[i + 1], lutG, lutIntsty / 100);
        iData[i + 2] = this.lerp(iData[i + 2], lutB, lutIntsty / 100);
      }

      this.imageContext.clearRect(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      );
      this.imageContext.putImageData(imageData, 0, 0);
      this.luttedImage = this.imageCanvas.toDataURL();
      this.hideLutted = false;
      this.loading = false;
    },
    saveCallback() {
      // if (this.image == undefined || this.luttedImage == "") return;
      // const url = this.luttedImage;
      // const fileName = this.image.substring(
      //   this.image.lastIndexOf("\\") + 1,
      //   this.image.lastIndexOf(".")
      // );
      // const path = this.image.substring(0, this.image.lastIndexOf("\\") + 1);
      // let savePath = dialog.showSaveDialog({
      //   defaultPath:
      //     path +
      //     fileName +
      //     " - " +
      //     this.selectedLutList.title.split(".")[0] +
      //     ".png",
      // });
      // if (savePath === undefined) return;
      // remove Base64 stuff from the Image
      // const base64Data = url.replace(/^data:image\/png;base64,/, "");
      // fs.writeFile(savePath, base64Data, "base64", function (err) {
      //   console.log(err);
      // });
    },
    lerp(a, b, n) {
      return (1 - n) * a + n * b;
    },
    addImage(event, another = false) {
      if (another) {
        this.selectedLutList = "";
        this.selectedLut = 0;
      }
      this.image = event;
      this.hideLutted = true;
      // this.luttedImage = "";
      // ipcRenderer.on("sharp-reply", (event, arg) => {
      //   console.log(arg); // prints "pong"
      // });
      // ipcRenderer.send("sharp-message", this.image);
      // TODO : sharp stuff
      // some package :
      // node-thumbnail
      // node-imagemagick
      // resize-image
      // easyimage
      // https://stackoverflow.com/questions/19262141/resize-image-with-javascript-canvas-smoothly
      // https://imagekit.io/blog/how-to-resize-image-in-javascript/
    },
  },
  components: {
    Loading,
    SelectOnePhoto,
  },
};
</script>

<style scoped>
.flex {
  width: max-content;
  margin: auto;
}

.sideBySideImg {
  max-width: 34vw;
}

.topElements {
  display: flex;
  justify-content: space-between;
}

.selectPhotoBtn {
  margin-top: 10vh;
}
</style>