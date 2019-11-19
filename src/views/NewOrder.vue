<template>
  <div class="base-grid">
    <div class="items">
      <v-card
        v-for="item in items"
        :key="item.name"
        outlined
        class="noselect"
        :color="item.color"
        :dark="item.dark"
        ripple
        @click="addToOrder(item)"
      >
        <v-card-title>{{item.name}}</v-card-title>
        <v-card-subtitle class="body-1">{{toPriceString(item.amount)}}</v-card-subtitle>
      </v-card>
    </div>
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
          <v-list-item-action>
            <v-btn icon @click="removeOne(item)">
              <v-icon color="grey lighten-1">mdi-minus-circle</v-icon>
            </v-btn>
        </v-list-item-action>
        </v-list-item>
      </v-card-text>
      <v-card-actions v-if="currentOrder.length > 0">
        <v-btn text outlined color="error" @click="tryDelete()">löschen</v-btn>
        <v-btn text outlined color="success" @click="paid">Bezahlt</v-btn>
    </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import store from '../store'
import firebase from '../firebase'

export default {
  data: () => ({
    items: store.items,
    currentOrder: store.currentOrder,
    transactionRef: store.selectedConcert.ref.collection("Transaktionen")
  }),
  computed: {
    toPriceString() {
      return amount => amount.toFixed(2) + "€";
    },
    totalPrice() {
      return this.currentOrder.reduce((acc, item) => {
        let price = this.items.find(e => e.name == item.name).amount
        return acc + price * item.count
      }, 0);
    }
  },
  methods: {
    addToOrder(item) {
      let existingItem = store.currentOrder.find(e => e.name == item.name)
      if (existingItem != undefined) {
        existingItem.count += 1;
      }
      else {
        store.currentOrder.push({
          name: item.name,
          count: 1
        })
      }
    },
    removeOne(item) {
      let itemIdx = store.currentOrder.findIndex(e => e.name == item.name)
      if (itemIdx >= 0) {
        store.currentOrder[itemIdx].count -= 1;
        if (store.currentOrder[itemIdx].count <= 0) {
          store.currentOrder.splice(itemIdx, 1)
        }
      }
    },
    tryDelete() {
      if (confirm('Bestellung zurücksetzen?')) {
        store.currentOrder.splice(0, store.currentOrder.length)
      }
    },
    paid() {
      let items = {};

      for (let item of store.currentOrder) {
        items[item.name] = item.count;
      }

      let pfandOnly = false
      if (store.currentOrder.length == 1 && store.currentOrder[0].name.includes("Pfand")) {
        pfandOnly = true
      }
      // send to firebase
      this.transactionRef.add({
        finished: pfandOnly,
        items: items,
        time: firebase.firestore.Timestamp.fromDate(new Date())
      });
      store.currentOrder.splice(0, store.currentOrder.length);
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
  min-width: 200px;
  min-height: 100px;
}

#current-order .order-count {
  padding-right: 10px;
}

@media only screen and (max-width: 900px) {
  .base-grid {
    grid-template-columns: 100%;
  }

  .items .v-card {
    min-width: 0;
    min-height: 0;
  }
}
</style>