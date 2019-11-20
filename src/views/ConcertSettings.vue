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
      <v-col xl="2" lg="4" sm="10">
        <v-select
          label="zu kopierendes Konzert"
          :items="store.concerts"
          item-text="name"
          item-value="id"
          v-model="copyFromConcert"
        ></v-select>
      </v-col>
      <v-col xl="2" lg="2" xs="10">
        <v-btn block>Kopieren</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-data-table :headers="itemHeaders" :items="store.selectedConcert.products">
        <template v-slot:item.action="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">edit</v-icon>
          <v-icon small @click="deleteItem(item)">delete</v-icon>
        </template>
      </v-data-table>
    </v-row>
    <v-row justify="center">
      <v-dialog v-model="dialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">Neues Produkt</v-btn>
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
                  <v-text-field v-model="editedItem.amount" label="Preis (€)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.color" label="Farbe (hex)"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field v-model="editedItem.dark" label="Dunkel"></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="save">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
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
      { text: "Dunkel", value: "dark" }
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
  methods: {
    editItem(item) {
      this.editedIndex = store.selectedConcert.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      const index = store.selectedConcert.products.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        store.selectedConcert.products.splice(index, 1);
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.desserts[this.editedIndex], this.editedItem);
      } else {
        this.desserts.push(this.editedItem);
      }
      this.close();
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Neues Produkt" : "Produkt bearbeiten";
    }
  }
};
</script>
<style scoped>
</style>