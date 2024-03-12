import React, { useState, useEffect } from "react";
import { loadStripeOnramp } from "@stripe/crypto";

import { CryptoElements, OnrampElement } from './StripeCryptoElements';
import "./App.css";

// Make sure to call loadStripeOnramp outside of a component’s render to avoid
// recreating the StripeOnramp object on every render.
// This is your test publishable API key.
const stripeOnrampPromise = loadStripeOnramp("pk_test_51NRzpwCIjyWqrxl4dbQ0dkQC3ZsqKHY35KtsUGjg5Dx2uGoHEOL0oFuUlyRNp3bQ25DJbb5YRYxD2ZWyL4U4FeOL00LRJTO8we");

export default function App() {
  const [clientSecret, setClientSecret] = useState("");
  const [message, setMessage] = useState("");

  console.log('Loading...',clientSecret, message, stripeOnrampPromise);

  useEffect(() => {
    // Fetches an onramp session and captures the client secret
    try {
      fetch(
      "/create-onramp-session",
      {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transaction_details: {
          destination_currency: "usdc",
          destination_exchange_amount: "13.37",
          destination_network: "ethereum",
        }
      }),
    })
      console.log('Res Body', JSON.stringify)
      .then((res) => {
        if (!res.ok) {
          // Handle any errors that occur
          throw new Error("Error in fetch");
        }
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret)
      });
    } catch(error) {
        // Handle any errors that occur
        console.error("Error in fetch:", error);
      };
  }, []);

  const onChange = React.useCallback(({ session }) => {
    setMessage(`OnrampSession is now in ${session.status} state.`);
  }, []);

  return (
    <div className="App">
      <h1>Show Me The Money!</h1>
      <CryptoElements stripeOnramp={stripeOnrampPromise}>
        {clientSecret && (
          <OnrampElement
            id="onramp-element"
            clientSecret={clientSecret}
            appearance={{ theme: "dark" }}
            onChange={onChange}
          />
        )}
      </CryptoElements>
      {message && <div id="onramp-message">{message}</div>}
    </div>
  );
}