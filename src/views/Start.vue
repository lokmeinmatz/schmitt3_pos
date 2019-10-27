<template>
  <div class="center" style="width: 100%; height: 100%; justify-content: center;">
    <v-card raised v-if="!loggedIn()">
      <v-card-title>LOGIN</v-card-title>
      <v-card-text>
        <v-text-field outlined label="Mail" v-model="mail"></v-text-field>
        <v-text-field outlined label="Password" v-model="password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="success" :loading="loggingIn" @click="login()">Verbinden</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text>
        <v-select label="Konzert" :items="concerts" item-text="name" item-value="id" @change="setConcert"></v-select>
        <v-btn to="/order" class="mr-4">Kasse</v-btn>
        <v-btn to="/process" class="mr-4">Ausgabe</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>

import store from '../store'
import firebase from '../firebase'

export default {
  data: () => ({
    mail: '',
    password: '',
    loggingIn: false
  }),
  computed: {
    concerts() {
      return store.concerts
    },
    toPriceString() {
      return amount => amount.toFixed(2) + "€";
    },
    totalPrice() {
      return store.currentOrder.reduce((acc, item) => {
        let price = this.items.find(e => e.name == item.name).amount;
        return acc + price * item.count;
      }, 0);
    }
  },
  methods: {
    async setConcert(d) {
      let docref = firebase.firestore().collection('Konzerte').doc(d)
      store.selectedConcert = {id: d, name: (await docref.get()).get('name'), ref: docref}
      console.log(store.selectedConcert)
    },
    loggedIn() {
      //eslint-disable-next-line
      return store.user != null
    },
    login() {
      this.loggingIn = true
      if (this.password.length == 0 || this.mail.length == 0) {
        console.error('missing password or mail')
        return
      }

      firebase.auth().signInWithEmailAndPassword(this.mail.trim(), this.password.trim())
      .then(() => {
        // TODO logged in
        console.log('logged in')
        this.loggingIn = false
      }).catch(error => {
        console.error(error)
        this.loggingIn = false
      })
    }
  }
};
</script>
<style scoped>
.base-grid {
  display: grid;
  grid-template-columns: auto 400px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

.items .v-card {
  margin: 5px;
  cursor: pointer;
}

#current-order .order-count {
  padding-right: 10px;
}

@media only screen and (max-width: 900px) {
  .base-grid {
    grid-template-columns: 100%;
  }
}
</style>