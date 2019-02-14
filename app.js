const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');


const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company: ${req.body.company}</li>
        <li>Email: ${req.body.email}</li>
        <li>Phone: ${req.body.phone}</li>
        <li>Message: ${req.body.message}</li>
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
            from: '"Nodemailer contact 👻" <euge.revol@gmail.com>', // sender address
            to: "euge.revol@outlook.com, eugenia.revol@globant.com", // list of receivers
            subject: "Node contact request ✔", // Subject line
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
        });
    });


})

// Port Listener
app.listen(5001, () => {
    console.log('Server started...');
})