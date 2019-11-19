<template>
  
</template>

<script>
import store from "../store";
//import firebase from "../firebase";

export default {
  data: () => ({
    items: store.items,
    currentOrder: store.currentOrder,
    moneyGiven: 0,
    transactionRef: store.selectedConcert.ref.collection("Transaktionen")
  }),
  methods: {
    
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