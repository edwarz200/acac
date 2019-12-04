'use strict'
var firebase = require('firebase-admin'),
    serviceAccount = require("./ramdb-9ae8d-firebase-adminsdk-9gii2-393ba3be57.json")

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: 'https://ramdb-9ae8d.firebaseio.com/'
})

const db = firebase.database()


module.exports = db