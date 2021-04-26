import firebase from 'firebase';

var firebaseConfig = {
  apiKey: 'AIzaSyDBwJUvnTHYSdhQ6RqOYZy5AwP2bTMaA9w',
  authDomain: 'imagebook-afa63.firebaseapp.com',
  projectId: 'imagebook-afa63',
  storageBucket: 'imagebook-afa63.appspot.com',
  messagingSenderId: '187670382698',
  appId: '1:187670382698:web:dcca163f0cc3b0782fa213',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export default firebase.firestore();
