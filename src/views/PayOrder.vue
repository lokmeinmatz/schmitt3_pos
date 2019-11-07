<template>
  <v-card id="current-order">
    <v-card-title>aktuelle Bestellung: {{toPriceString(totalPrice)}}</v-card-title>
    <v-card-text>
      <v-list-item v-for="(item, idx) in currentOrder" :key="idx">
        <v-list-item-content>
          <v-list-item-title>
            <span class="order-count font-italic font-weight-light">{{item.count}}x</span>
            {{item.name}}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <h2 class="my-4">Geld</h2>
      <div style="display: flex; align-items: center;">
        <v-btn color="primary" @click="moneyGiven = totalPrice">Passend</v-btn>
        <span class="ma-2">oder</span>
        <v-text-field label="Gegeben" type="number" v-model="moneyGiven"></v-text-field>
      </div>
      <h3>Rückgeld: {{toPriceString(moneyBack)}}</h3>
    </v-card-text>
    <v-card-actions style="height: 70px; flex-wrap: wrap;">
      <v-btn text outlined color="error" @click="goBack()" class="pa-2">zurück zu Bestellung</v-btn>
      <v-btn text outlined :color="moneyBack >= 0 ? 'success' : 'orange'" @click="paid()" class="pa-2">
        Bezahlt
        <v-icon>mdi-check-all</v-icon>
      </v-btn>
      <v-alert v-if="moneyBack < 0" outlined type="error" class="pa-2 my-0 ml-4">
        Nicht genug Geld bekommen!
      </v-alert>
    </v-card-actions>
  </v-card>
</template>

<script>
import store from "../store";
import firebase from "../firebase";

export default {
  data: () => ({
    items: store.items,
    currentOrder: store.currentOrder,
    moneyGiven: 0,
    transactionRef: store.selectedConcert.ref.collection("Transaktionen")
  }),
  computed: {
    toPriceString() {
      return amount => amount.toFixed(2) + "€";
    },
    totalPrice() {
      return this.currentOrder.reduce((acc, item) => {
        let price = this.items.find(e => e.name == item.name).amount;
        return acc + price * item.count;
      }, 0);
    },
    moneyBack() {
      return this.moneyGiven - this.totalPrice;
    }
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    paid() {
      let items = {};

      for (let item of store.currentOrder) {
        items[item.name] = item.count;
      }
      // send to firebase
      this.transactionRef.add({
        finished: false,
        items: items,
        time: firebase.firestore.Timestamp.fromDate(new Date())
      });
      store.currentOrder.splice(0, store.currentOrder.length);
      this.goBack();
    }
  }
};
</script>
<style scoped>
.items {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  align-content: flex-start;
}

#current-order .order-count {
  padding-right: 10px;
}
</style>