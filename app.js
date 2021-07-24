const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const chalk = require('chalk');
app.use(bodyParser.urlencoded({ extended: true }));
const https = require('https');

const port = 3000;
app.listen(port, () => {
    console.log(chalk.yellow(`server is running on port ${port}`));
});

app.use(express.static('public'));


// route the home page as the sign up page . 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/signup.html')

    // catch the input value with bodyParser . 
    app.post('/', (req, res) => {
        const fName = req.body.firstName;
        const lName = req.body.lastName;
        const email = req.body.email;
        console.log(fName, lName, email);

        let data = {
            members: [
                {
                    email_address: email,
                    status: "subscribed",
                    merge_fields: {
                        FNAME: fName,
                        LNAME: lName
                    }
                }
            ]
        }
        let jsonData = JSON.stringify(data);
        const url = "https://us6.api.mailchimp.com/3.0/lists/f5d9d9f26e";
        const options = {
            method: 'POST',
            auth: "aviVovgen:63f4b96621e181c740144dda3955905-us6"
        }

        // function that shows us if the response is equal to 200 so render the success page, if not render the failure page .  
        const request = https.request(url, options, (response) => {

            response.statusCode === 200 ? res.sendFile(__dirname + '/success.html')
                :
                res.sendFile(__dirname + '/failure.html')


            response.on('data', (data) => {
                console.log(JSON.parse(data));
            })
        })
        request.write(jsonData);
        request.end();

    })

    // route for the back button from the failure page. 
    app.post('/failure', (req, res) => {
        res.redirect('/');
    })

    //api key 
    //763f4b96621e181c740144dda3955905-us6

    // list id 
    // f5d9d9f26e
});



