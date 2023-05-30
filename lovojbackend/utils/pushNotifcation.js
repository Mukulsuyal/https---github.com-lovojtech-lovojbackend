const admin = require('firebase-admin');

 

// Initialize the Firebase Admin SDK with your service account credentials
const serviceAccount = require('../path/to/serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

 

// Function to send a push notification to a device token using FCM
async function sendNotification(deviceToken, title, body) {
  const message = {
    token: deviceToken,
    notification: {
      title,
      body
    }
  };

 

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent successfully:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

 

module.exports = { sendNotification };