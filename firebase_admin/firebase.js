const admin = require('firebase-admin');
const serviceAccount = require('./withcorn-fcm-firebase-adminsdk-fbsvc-82bbf855c2.json'); // Firebase 콘솔에서 받은 키 파일

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;