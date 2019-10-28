<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase" @click="goHome()">
        <span>Schmitt3</span>
        <span class="font-weight-light">POS</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
       
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-btn
        text
        to="/"
      >
        Konzert: {{concertName}}
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import store from './store'

export default {
  name: 'App',
  components: {
  },
  data: () => ({
    store: store
  }),
  computed: {
    concertName() {
      if(store.selectedConcert) {
        return store.selectedConcert.name
      } 
      return 'nicht ausgewählt'
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
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