import React from "react";
import "./Transactions.css";

export const Transactions = ({ transactions }) => {
    // TODO: Improve tx parsing to display internal payments, incomplete payments, and further verify the transactions we are listing out
  
// turn unix timestamp into a date    
    const parseTx = (tx) => {
    // TODO: format date further to include hours, minutes, and seconds
    const date = new Date(tx.time * 1000);
    const formattedDate = date.toLocaleDateString("en-US");
    //TODO: Handle pending payments
    if (tx.pending) return null;

//Sent
    if (tx.amount > 0) {
      return (
        <div key={tx.checking_id} className="tx-item">
          <p>Received from {tx.bolt11.substring(0, 25)}...</p>
          <p>+{tx.amount / 1000} sats</p>
          <p className="transaction-date">{formattedDate}</p>
        </div>
      );
    }

//Recieved
    if (tx.amount < 0) {
      return (
        <div key={tx.checking_id} className="tx-item">
          <p>Payment to {tx.bolt11.substring(0, 25)}...</p>
          <p>{tx.amount / 1000} sats</p>
          <p className="transaction-date">{formattedDate}</p>
        </div>
      );
    }
  };

  return (
    <div>
      <h3>Transactions</h3>
      {transactions.map((transaction) => {
        return parseTx(transaction);
      })}
    </div>
  );
};

export default Transactions;