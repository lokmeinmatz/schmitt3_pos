import firebase from './firebase'
import store from './store'

export function toPriceString(amount) {
    return amount.toFixed(2) + "€";
}



export async function getProductsOfConcert(id) {
    const concref = firebase.firestore().collection('Konzerte').doc(id)
    const concsshot = await concref.get()
    if (!concsshot.exists) {
        // eslint-disable-next-line
        console.error('Concert id not found')
        return null
    }

    return concsshot.get('products')
}

export async function setProductsAndNameOfCurrentConcert(products, name) {
    if (products == null || name == null || name.trim().length < 1) {
        alert('kein name oder keine Produkte')
        return
    }
    const concref = store.selectedConcert.ref
    const concsshot = await concref.get()
    if (!concsshot.exists) {
        // eslint-disable-next-line
        console.error('Concert id not found')
        return
    }
    store.selectedConcert.products = products
    store.selectedConcert.name = name
    store.concerts.find(e => e.id = store.selectedConcert.id).name = name
    await concref.update({products: products, name: name})
    alert('Produkt und/oder Name geändert. Lade die Seite auf allen Geräten neu, um die Daten zu akualisieren!')
}