if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

let stripePublicKey = process.env.STRIPE_PUBLIC_KEY;
let stripeSecretKey = process.env.STRIPE_SECRET_KEY;

const { json } = require('body-parser');
const { request } = require('express');
const fs = require('fs');
const qs = require('querystring');

let express = require('express'),
    app = express(),
    exphbl = require('express-handlebars'),
    bodyParser = require('body-parser'),
    stripe = require('stripe')(stripeSecretKey);

let amount = 1;

app.set('view engine', 'handlebars');
app.use((req, res, next) => {
    // req.rawBody = '';
    // req.on('data', function(chunk){
    //     req.rawBody += chunk;
    // });

    // req.on('end', function(){
    //     next();
    // });

    if(req.originalUrl === '/webhook'){
        next();
    }else{
        bodyParser.json()(req, res, next);
    }
});

app.use(bodyParser.json());
  
app.use(express.static('public'));

app.engine('handlebars', exphbl({
    layoutsDir: __dirname + '/views/layout',
}));

app.get('/', (req, res) => {
    res.render('button', {
        layout: 'index',
        stripePublicKey: stripePublicKey,
        price: amount
    })
});

let id;

app.post('/get-form-data',(req, res) => {
    if(req.method == 'POST'){
        let body = '';

        req.on('data', (chunk) => {
            body += chunk
        });

        req.on('end', () => {
            let post = body;
            // res.redirect('/');

            stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                locale: 'auto',
                line_items: [
                    {
                        price: process.env.PRICE,
                        quantity: post
                    },
                    ],
                    mode: 'payment',
                    success_url: `http://localhost:5000/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: 'http://localhost:5000/cancel',
                })
                .then(response => {

                    return res.json(response);
                })
                .catch(err => console.log(err))
        })
    }

});

app.get('/success', (req, res) => {
    res.render('success', {
        layout: 'index'
    })
});


app.get('/cancel', (req, res) => {
    res.render('cancel', {
        layout: 'index'
    })
});

// app.post('/webhook', (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     const endpointSecret = 'whsec_PoCp6OxvZayS7tXqrIbnzsXgbfeWn8cj';
//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
//     } catch (error) {
//         return res.status(400).send(`Webhook error ${error.message}`);
//     }

//     if(event.type === 'checkout.session.completed'){
//         const paymentIntent = event.data.object;
//         handleCheckoutSession(paymentIntent)
//     }

//       function handleCheckoutSession(paymentIntent){
//         console.log('Successful Purchase');
//       }
    

// });

app.listen(5000);