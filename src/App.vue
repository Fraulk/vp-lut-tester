<template>
  <v-app>
    <v-main style="margin: 1rem 2rem">
      <Lut/>
    </v-main>
  </v-app>
</template>

<script>
import Lut from './components/Lut';

export default {
  name: 'App',

  components: {
    Lut,
  },

  data: () => ({
    //
  }),
};
</script>
