const firebase = require("firebase");

const firebaseConfig = {
  apiKey: "AIzaSyAg42vBXErHQODfLGwmi6jDO6Nm70th-Pg",
  authDomain: "project-b767e.firebaseapp.com",
  databaseURL: "https://project-b767e-default-rtdb.firebaseio.com",
  projectId: "project-b767e",
  storageBucket: "project-b767e.appspot.com",
  messagingSenderId: "381283057719",
  appId: "1:381283057719:web:9a383dacbaad1d4b4e7fb2",
  measurementId: "G-ZPRPLLFDY5",
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
// let obj = { name: "pavan", registration: "191fa04057" };
// database.ref("users").set(obj, (error) => {
//   if (error) {
//     console.log("error");
//   } else {
//     console.log("success");
//   }
// });
database
  .ref("users")
  .once("value")
  .then(function (snapshot) {
    console.log(snapshot.val());
  });
