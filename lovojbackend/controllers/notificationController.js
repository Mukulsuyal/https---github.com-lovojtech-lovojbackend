const User = require("../models/user");
const { sendNotification } = require('../utils/pushNotifcation');

exports.sendNotificationToUser = async (req, res) => {
    const { userId, title, body } = req.body;
    try {
      // Find the user by their ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      // Get the device token for the user
      const deviceToken = user.deviceToken;
  
      // Send the push notification
      await sendNotification(deviceToken, title, body);
  
      return res.json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };