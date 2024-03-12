const express = require("express");
const app = express();
// This is your test secret API key.
const Stripe = require("stripe");
const stripe = Stripe('sk_test_51NRzpwCIjyWqrxl4QEulZiR6LjQ0KEB5JVogEIyEZUF5ZJZ2EiBMrPen5O98FHtFY2DFCRRQlwuZBk4CmkbfPz0t00DOLEia5G');
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