const nodemailer = require('nodemailer');

module.exports = (form,res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${form.name}</li>
        <li>Company: ${form.company}</li>
        <li>Email: ${form.email}</li>
        <li>Phone: ${form.phone}</li>
        <li>Message: ${form.message}</li>
    </ul>
    `;

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = nodemailer.createTestAccount((err, account) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    });
    // setup email data with unicode symbols
    let mailOptions = {
      from: `"${form.name} 👻" <${form.email}>`,  // sender address
      to: 'euge.revol@outlook.com', // list of receivers
      subject: form.subject || 'Node contact request ✔',
      text: "Hello world?", // plain text body
      html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      res.render('contact', { msg: 'Email has been sent!' });
      console.log('Message sent: ' + info.response);
      // res.status(200).send();
    });
  });
}