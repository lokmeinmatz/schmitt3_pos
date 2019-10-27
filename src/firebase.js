import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import store from './store'

const firebaseConfig = {
    apiKey: 'AIzaSyACnUUzMfNtMYpboSjF78pCOyT4fuMXJeY ',
    authDomain: "schmitt3-pos.firebaseapp.com",
    databaseURL: "https://schmitt3-pos.firebaseio.com",
    projectId: "schmitt3-pos",
    appId: "1:144227293877:web:b2dcc7265b1455a8817cfc"

}

firebase.initializeApp(firebaseConfig)

firebase.auth().onAuthStateChanged(usr => {
    store.user = usr
    
    if (usr) {
        let db = firebase.firestore()
        store.concerts.splice(0, store.concerts.length)
        db.collection('Konzerte').get().then(qsnapshot => {
            qsnapshot.forEach(doc => {
                store.concerts.push({id: doc.id, name: doc.get('name')})
            })
        })
    }
})

export default firebase