const mailgun = require("mailgun.js");

// Initialize Mailgun client
const mg = mailgun.client({ username: 'api', key: 'f2839e36d0e2b410b0cf75fb98576a65-f68a26c9-a08e5edb' });

// Define email parameters
const data = {
  from: 'Excited User <mailgun@yashashree.me>',
  to: 'yashashreepatel@gmail.com',
  subject: 'Hello',
  text: 'Testing some Mailgun awesomeness!'
};

// Send the email
mg.messages.create('yashashree.me', data)
  .then(msg => console.log("Email sent successfully!", msg))
  .catch(error => console.error("Error sending email:", error));
