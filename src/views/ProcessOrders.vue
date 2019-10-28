<template>
  <div class="list">
    <v-card outlined v-for="order in openOrders" :key="order.id">
      <v-card-text class="order">
        <div class="items">
          <v-list-item v-for="(count, name) in order.items" :key="name">
            <v-list-item-content>
              <v-list-item-title>
                <span class="order-count font-italic font-weight-light">{{count}}x</span>
                {{name}}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
        <v-btn color="success" x-large block @click="finish(order.id)">Fertig</v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import store from '../store'

export default {
  data: () => ({
    openOrders: [],
    transactionRef: null
  }),
  mounted() {
    // 
    if (!store.selectedConcert) {
      alert("Bitte gehe zur Startseite und wähle ein Konzert")
      return
    }

    this.transactionRef = store.selectedConcert.ref.collection('Transaktionen')
    this.transactionRef.onSnapshot({
      error: e => console.error(e),
      next: snapshot => {
        let changes = snapshot.docChanges()

        for (let change of changes) {
          if (change.oldIndex == -1 && !change.doc.get('finished')) {
            // new order
            this.openOrders.push({id: change.doc.id, ...change.doc.data()})
          }
          else if (change.doc.get('finished')) {
            const idx = this.openOrders.findIndex(e => e.id == change.doc.id)
            if (idx >= 0) this.openOrders.splice(idx, 1)
          }
        }
      }
    })
  },
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
      return this.moneyGiven - this.totalPrice
    }
  },
  methods: {
    finish(id) {
      // eslint-disable-next-line
      console.log('removing ', id)
      
      this.transactionRef.doc(id).update({finished: true})
      // eslint-disable-next-line
      .catch(e => console.error(e))
    }
  }
};
</script>
<style scoped>
 .order-count {
  padding-right: 10px;
}

.order {
  display: grid;
  grid-template-columns: auto 100px;
}
</style>