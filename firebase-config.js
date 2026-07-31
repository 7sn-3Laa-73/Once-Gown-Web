/**
 * Once Gown - Firebase Backend Integration
 * Connected to Firebase Project: oncegown-fb1fc
 * Collection: `dresses`
 */

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjP1_MBSaMwK5iKVXHN8hpATQbyG7oDfc",
  authDomain: "oncegown-fb1fc.firebaseapp.com",
  projectId: "oncegown-fb1fc",
  storageBucket: "oncegown-fb1fc.firebasestorage.app",
  messagingSenderId: "22004551283",
  appId: "1:22004551283:web:08cb7489ccdaf43ba02406",
  measurementId: "G-GVFH1SV089"
};

let firebaseApp = null;
let db = null;
let analytics = null;

function initFirebaseBackend() {
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebaseApp = firebase.initializeApp(firebaseConfig);
      } else {
        firebaseApp = firebase.app();
      }
      db = firebase.firestore();
      if (firebase.analytics) {
        analytics = firebase.analytics();
      }
      console.log(' [Once Gown] Successfully connected to Firebase Backend!');
      console.log(' Firestore Project ID:', firebaseConfig.projectId);
      console.log(' Target Collection: dresses');
    } else {
      console.warn('⚠️ Firebase SDK loading... waiting for script tags.');
    }
  } catch (err) {
    console.error(' Firebase Connection Error:', err);
  }
}

// Initialize on script execute
initFirebaseBackend();

/**
 * Save Dress Submission Payload directly to Firestore `dresses` collection
 * @param {Object} payload Complete dress submission data
 * @returns {Promise<string>} Created Document ID
 */
async function saveDressToFirestore(payload) {
  // Ensure DB connection
  if (!db) {
    initFirebaseBackend();
  }

  if (!db) {
    console.warn('⚠️ Firestore offline fallback mode. Generating offline doc ID.');
    return 'offline_doc_' + Date.now();
  }

  try {
    console.log('🚀 Sending dress submission payload to Firestore collection "dresses"...');
    const docRef = await db.collection('dresses').add(payload);
    console.log('🎉 SUCCESS! Document saved in Firestore with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error writing document to Firestore:', error);
    // Throw error so app UI can inform user
    throw new Error('فشل الحفظ في قاعدة البيانات Firebase: ' + (error.message || 'يرجى التأكد من قواعد Firestore Rules'));
  }
}
