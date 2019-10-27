<template>
  <div class="base-grid">
    <div class="items">
      <v-card
        v-for="item in items"
        :key="item.name"
        min-width="200px"
        min-height="100px"
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
      <v-card-title>aktuelle Bestellung</v-card-title>
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
        <v-btn text outlined color="error">löschen</v-btn>
        <v-btn text outlined color="success">Bezahlen</v-btn>
    </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    items: [
      { name: "Weißwein", amount: 2.5, color: "#caf216" },
      { name: "Rotwein", amount: 2.5, color: "#750802", dark: true },
      { name: "Weinschorle", amount: 2, color: "#f5ffe0" },
      { name: "Cola", amount: 1.5, color: "#f22116" },
      { name: "Fanta", amount: 1.5, color: "#f2d516" },
      { name: "Sprite", amount: 1.5, color: "#07b558" },
      { name: "Wasser", amount: 1, color: "#52bdfa" },
      { name: "Pfand 1x", amount: -1, color: "#d652fa" }
    ],
    currentOrder: []
  }),
  computed: {
    toPriceString() {
      return amount => amount.toFixed(2) + "€";
    }
  },
  methods: {
    addToOrder(item) {
      let existingItem = this.currentOrder.find(e => e.name == item.name)
      if (existingItem != undefined) {
        existingItem.count += 1;
      }
      else {
        this.currentOrder.push({
          name: item.name,
          count: 1
        })
      }
    },
    removeOne(item) {
      let itemIdx = this.currentOrder.findIndex(e => e.name == item.name)
      if (itemIdx >= 0) {
        this.currentOrder[itemIdx].count -= 1;
        if (this.currentOrder[itemIdx].count <= 0) {
          this.currentOrder.splice(itemIdx, 1)
        }
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

@media only screen and (max-width: 900px) {
  .base-grid {
    grid-template-columns: 100%;
  }
}
</style>