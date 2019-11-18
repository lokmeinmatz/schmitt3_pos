<template>
  <div class="root">
    <v-card v-if="pageStatus == 'notGenerated'">
      <v-card-title>Konzert-Statistik nicht generiert</v-card-title>
      <v-card-subtitle>Bitte nur einmal nach dem Konzert generieren, benötigt viel Datenbank-Kontingent</v-card-subtitle>
      <v-card-actions>
        <v-btn @click="generateData()">Statistik generieren</v-btn>
      </v-card-actions>
    </v-card>
    <div class="stats" v-else-if="pageStatus == 'ready'">
      <v-data-table :headers="headers" :items="statsTable"></v-data-table>
      
      <v-btn @click="generateData()">Statistik updaten (nicht oft ausführen!)</v-btn>
    </div>

    <v-overlay :value="pageStatus == 'loading'">
      <div id="loader-content">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
        <h3 class="white--text mt-4">Daten werden von Firebase geladen...</h3>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import store from "../store";

/*

stats format per concert:

stats: {
  selledItems: {
    [Item1 name] : [Count<number>],
    [Item1 name] : [Count<number>],
    ...
  }
}
*/
export default {
  data: () => ({
    pageStatus: "loading",
    statsFB: undefined,
    headers: [
      {
        text: "Produkt",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Einheiten verkauft", value: "count" },
      { text: "Umsatz", value: "sales" }
    ]
  }),
  mounted() {
    if (!store.selectedConcert) {
      alert("Bitte gehe zur Startseite und wähle ein Konzert");
      return;
    }
    // check if stats are allready generated

    store.selectedConcert.ref
      .get()
      .then(snapshot => {
        this.statsFB = snapshot.get("stats");
        if (this.statsFB == undefined) {
          this.pageStatus = "notGenerated";
        } else {
          this.pageStatus = "ready";
        }
      })
      .catch(e => {
        // eslint-disable-next-line
        console.error(e);
      });
  },
  computed: {
    
    statsTable() {
      let res = []
      if (this.statsFB == null) return res
      let totalCurrent = {name: 'Total in der Kasse', count: 0, sales: 0}
      let totalWithDeposit = {name: 'Total mit Pfand', count: 0, sales: 0}

      for(let si in this.statsFB.selledItems) {
        let count = this.statsFB.selledItems[si]
        let cost = store.items.find(e => e.name == si).amount
        res.push({name: si, count: count, sales: this.toPriceString(count * cost)})
        if (!si.includes('Pfand')) {
          totalWithDeposit.count += count
          totalWithDeposit.sales += count * (cost - 1)
          totalCurrent.count += count
        }
        totalCurrent.sales += count * cost
      }
      totalWithDeposit.sales = this.toPriceString(totalWithDeposit.sales)
      totalCurrent.sales = this.toPriceString(totalCurrent.sales)
      res.push(totalWithDeposit, totalCurrent)
      return res
    }
  },
  methods: {
    toPriceString(amount) {
      return amount.toFixed(2) + "€";
    },
    generateData() {
      this.pageStatus = "loading";
      // TODO generate data
      let selledItems = {}
      store.selectedConcert.ref
        .collection("Transaktionen")
        .get()
        .then(snapshot => {
          snapshot.forEach(order => {
            let allItems = order.get("items");
            for (let itemName in allItems) {
              if (!(itemName in selledItems)) {
                selledItems[itemName] = allItems[itemName]
              } else {
                selledItems[itemName] += allItems[itemName]
              }
            }
          });

          this.pageStatus = 'ready'
          this.statsFB = {
            selledItems: selledItems
          }

          store.selectedConcert.ref.update({stats: this.statsFB})
        });
    }
  }
};
</script>
<style scoped>
#loader-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>