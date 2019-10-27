<template>
  <div class="center" style="width: 100%; height: 100%; justify-content: center;">
    <v-card raised >
      <v-card-title>LOGIN</v-card-title>
      <v-card-text>
        <v-text-field outlined label="Mail"></v-text-field>
        <v-text-field outlined label="Password"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn text color="success">Verbinden</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>

import store from '../store'

export default {
  data: () => ({
    items: [
      { name: "Weißwein", amount: 3.5, color: "#caf216" },
      { name: "Rotwein", amount: 3.5, color: "#750802", dark: true },
      { name: "Weinschorle", amount: 3, color: "#f5ffe0" },
      { name: "Cola", amount: 2.5, color: "#f22116" },
      { name: "Fanta", amount: 2.5, color: "#f2d516" },
      { name: "Sprite", amount: 2.5, color: "#07b558" },
      { name: "Wasser", amount: 2, color: "#52bdfa" },
      { name: "-Pfand 1x", amount: -1, color: "#d652fa" }
    ]
  }),
  computed: {
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
    addToOrder(item) {
      let existingItem = store.currentOrder.find(e => e.name == item.name);
      if (existingItem != undefined) {
        existingItem.count += 1;
      } else {
        store.currentOrder.push({
          name: item.name,
          count: 1
        });
      }
    },
    removeOne(item) {
      let itemIdx = store.currentOrder.findIndex(e => e.name == item.name);
      if (itemIdx >= 0) {
        store.currentOrder[itemIdx].count -= 1;
        if (this.currentOrder[itemIdx].count <= 0) {
          store.currentOrder.splice(itemIdx, 1);
        }
      }
    },
    tryDelete() {
      if (confirm("Bestellung zurücksetzen?")) {
        store.currentOrder = [];
      }
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

#total-price {
}

@media only screen and (max-width: 900px) {
  .base-grid {
    grid-template-columns: 100%;
  }
}
</style>