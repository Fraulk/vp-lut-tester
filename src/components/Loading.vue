<template>
  <v-dialog
    v-model="loading"
    persistent
    width="370"
    class="d-flex justify-center"
  >
    <v-card color="primary" dark class="pa-2">
      <v-card-title> Lut is being applied, please wait. </v-card-title>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({}),
  props: {
    loading: Boolean,
  },
};
</script>