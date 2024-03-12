const express = require("express");
const app = express();
require('dotenv').config()
// This is your test secret API key.
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_PRIVATE_KEY);
const OnrampSessionResource = Stripe.StripeResource.extend({
  create: Stripe.StripeResource.method({
    method: 'POST',
    path: 'crypto/onramp_sessions',
  }),
});


app.use(express.static("public"));
app.use(express.json());

app.post("/create-onramp-session", async (req, res) => {
  const { transaction_details } = req.body;

  // Create an OnrampSession with the order amount and currency
  const onrampSession = await new OnrampSessionResource(stripe).create({
    transaction_details: {
      destination_currency: transaction_details["destination_currency"],
      destination_exchange_amount: transaction_details["destination_exchange_amount"],
      destination_network: transaction_details["destination_network"],
    },
    customer_ip_address: req.socket.remoteAddress,
  });

  res.send({
    clientSecret: onrampSession.client_secret,
  });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));