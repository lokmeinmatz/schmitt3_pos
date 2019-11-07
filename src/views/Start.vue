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
        <v-select
          label="Konzert"
          :items="concerts"
          item-text="name"
          item-value="id"
          @change="setConcert"
        ></v-select>
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
    loggingIn: false
  }),
  computed: {
    concerts() {
      return store.concerts;
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
      let docref = firebase
        .firestore()
        .collection("Konzerte")
        .doc(d);
      store.selectedConcert = {
        id: d,
        name: (await docref.get()).get("name"),
        ref: docref
      };
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