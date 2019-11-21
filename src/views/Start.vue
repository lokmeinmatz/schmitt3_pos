<template>
  <div class="center" style="width: 100%; height: 100%; justify-content: center;">
    <v-card raised v-if="!loggedIn()">
      <v-card-title>LOGIN</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="login()">
          <v-text-field outlined label="Mail" v-model="mail"></v-text-field>
          <v-text-field
            outlined
            label="Password"
            v-model="password"
            :append-icon="showPassword ? 'mdi-visibility' : 'mdi-visibility_off'"
            @click:append="showPassword = !showPassword"
            :type="showPassword ? 'text' : 'password'"
          ></v-text-field>
          <v-btn text color="success" :loading="loggingIn" type="submit">Verbinden</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-text>
        <v-row align="center" justify="center">
          <v-col dense>
            <v-select
              label="Konzert"
              :items="concerts"
              item-text="name"
              item-value="id"
              v-model="concert"
            ></v-select>
          </v-col>
          <v-col cols="2" dense style="padding: 0; min-width: 80px;">
            <v-icon class="ml-1" v-if="store.selectedConcert != null" @click="$router.push('/concert-settings')">mdi-square-edit-outline</v-icon>
            <v-icon class="ml-1" @click="newConcert">mdi-plus-box-outline</v-icon>
          </v-col>
        </v-row>
        <v-btn to="/order" class="mr-4 mb-4">Kasse</v-btn>
        <v-btn to="/process" class="mr-4 mb-4">Ausgabe</v-btn>
        <v-btn to="/stats" class="mr-4 mb-4">Statistik</v-btn>
        <v-btn @click="logout()" class="mr-4 mb-4">Logout</v-btn>
      </v-card-text>
    </v-card>
    <v-btn id="github" text href="https://github.com/lokmeinmatz/schmitt3_pos">Github</v-btn>
  </div>
</template>

<script>
import store from "../store";
import firebase from "../firebase";

export default {
  data: () => ({
    mail: "",
    password: "",
    showPassword: false,
    loggingIn: false,
    store: store
  }),
  computed: {
    concerts() {
      return store.concerts;
    },
    concert: {
      set(v) { this.setConcert(v) },
      get() { return store.selectedConcert ? store.selectedConcert.id : null }
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
      let docref = firebase
        .firestore()
        .collection("Konzerte")
        .doc(d);
      let concertSnapshot = await docref.get()

      store.selectedConcert = {
        id: d,
        name: concertSnapshot.get('name'),
        products: concertSnapshot.get('products'),
        ref: docref
      };
    },
    async newConcert() {

      // create new concert document
      const randend = btoa(Date.now().toString())
      const name = 'newConcert' + randend.substr(randend.length - 13, 8)
      let ndoc = await firebase.firestore().collection('Konzerte').add({
        name: name,
        products: []
      })

      store.concerts.push({id: ndoc.id, name: name})
      this.concert = ndoc.id
      alert('neues Konzert: ' + name)
    },
    async logout() {
      await firebase.auth().signOut()
    },
    loggedIn() {
      //eslint-disable-next-line
      return store.user != null;
    },
    login() {
      this.loggingIn = true;
      if (this.password.length == 0 || this.mail.length == 0) {
        // eslint-disable-next-line
        alert("missing password or mail");
        return;
      }

      firebase
        .auth()
        .signInWithEmailAndPassword(this.mail.trim(), this.password.trim())
        .then(() => {
          // eslint-disable-next-line
          console.log("logged in");
          this.loggingIn = false;
        })
        .catch(error => {
          // eslint-disable-next-line
          alert(error);
          this.loggingIn = false;
        });
    }
  }
};
</script>
<style scoped>
.center {
  display: flex;
  flex-direction: column;
}

#github {
  margin: 10px;
  margin-top: 30px;
}

@media only screen and (max-width: 900px) {
  .base-grid {
    grid-template-columns: 100%;
  }
}
</style>