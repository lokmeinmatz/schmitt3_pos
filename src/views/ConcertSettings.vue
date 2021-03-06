<template>
  <div>
    <v-snackbar v-model="snackbar">
      Keine bestehenden Items ändern, nachdem der Verkauf begonnen wurde!
      <v-btn color="error" text @click="snackbar = false">Ok</v-btn>
    </v-snackbar>
    <v-row justify="center">
      <h2>Konzert-Einstellungen</h2>
    </v-row>
    <v-row justify="center">
      <v-col xl="2" lg="4" sm="10">
        <v-text-field label="Konzert-Name" v-model="store.selectedConcert.name" outlined></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <h4 class="subtitle-1">Angebot</h4>
    </v-row>
    <v-row justify="center" align="center">
      <v-col xl="2" lg="4" sm="6" col="10">
        <v-select
          label="zu kopierendes Konzert"
          :items="store.concerts"
          item-text="name"
          item-value="id"
          v-model="copyFromConcert"
        ></v-select>
      </v-col>
      <v-col xl="2" lg="2">
        <v-btn block @click="copyProductsFromConcert">Kopieren</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-data-table :headers="itemHeaders" :items="formattedProducts">
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="ma-2" v-on="on">Neues Produkt</v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.name" label="Produktname"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.amount" type="number" label="Preis (€)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.color" label="Farbe (hex)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    v-model="editedItem.dark"
                    :label="editedItem.dark ? 'Dunkel' : 'Hell'"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="saveItemEdit">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-btn color="success" dark class="ma-2" @click="saveChanges">Änderungen speichern</v-btn>
    </v-row>
  </div>
</template>

<script>
import {toPriceString, getProductsOfConcert, setProductsAndNameOfCurrentConcert} from '../utils'
import store from "../store";
//import firebase from "../firebase";

export default {
  data: () => ({
    store: store,
    copyFromConcert: null,
    localProducts: [],
    editedIndex: -1,
    itemHeaders: [
      { text: "Bezeichnung", value: "name" },
      { text: "Preis", value: "amount" },
      { text: "Farbe (hex)", value: "color" },
      { text: "Dunkel", value: "dark" },
      { text: "Actions", value: "action", width: 100 }
    ],
    dialog: false,
    snackbar: true,
    editedItem: {
      name: "",
      amount: 0.0,
      color: "#ff00ff",
      dark: false
    },
    defaultItem: {
      name: "",
      amount: 0.0,
      color: "#ff00ff",
      dark: false
    }
  }),
  mounted() {
    this.localProducts = store.selectedConcert.products.map(e => Object.assign({}, e))
  },
  methods: {
    async copyProductsFromConcert() {
      if (this.copyFromConcert == null) return
      const p = await getProductsOfConcert(this.copyFromConcert)

      if (p == null) {alert('Failed to load products'); return}

      this.localProducts = p
    },
    editItem(item) {
      this.editedIndex = this.localProducts.findIndex(e => e.name == item.name)
      if(this.editedIndex < 0) {
        // eslint-disable-next-line
        console.error('item doesn\'t exist')
        return
      }
      this.editedItem = Object.assign({}, this.localProducts[this.editedIndex]);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = this.localProducts.findIndex(e => e.name == item.name)
      confirm("Are you sure you want to delete this item?") &&
        this.localProducts.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    saveItemEdit() {
      const famnt = parseFloat(this.editedItem.amount)

      if (isNaN(famnt)) {
        alert('Preis ist keine gültige Nummer.')
      }
      if (this.editedIndex > -1) {
        Object.assign(this.localProducts[this.editedIndex], this.editedItem)
        this.localProducts[this.editedIndex].amount = famnt
      } else {
        this.editedItem.amount = famnt
        this.localProducts.push(this.editedItem);
      }
      this.close();
    },
    saveChanges() {
      setProductsAndNameOfCurrentConcert(this.localProducts, this.store.selectedConcert.name)
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neues Produkt" : "Produkt bearbeiten";
    },
    formattedProducts() {
      return this.localProducts.map(v => {
        let n = Object.assign({}, v)
        n.amount = toPriceString(n.amount)
        n.dark = n.dark ? 'Ja' : 'Nein'
        return n
      })
    }
  }
};
</script>
<style scoped>
</style>