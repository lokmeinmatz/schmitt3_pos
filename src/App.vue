<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Schmitt3</span>
        <span class="font-weight-light">POS</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="center">
        <p class="headline">Status: {{}}</p>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn
        text
        href="https://github.com/lokmeinmatz/schmitt3_pos"
        target="_blank"
      >
        <span>BETA</span>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    //
  }),
};
</script>
<style>
.center {
  display: flex;
  align-items: center;
}

.center p {
  margin: 0;
}

.noselect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Opera and Firefox */
}
</style>