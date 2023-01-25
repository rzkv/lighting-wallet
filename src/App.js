import React, { useEffect, useState } from "react";
import Transactions from "./components/Transactions";
import Buttons from "./components/Buttons";
import Chart from "./components/Chart";
import axios from "axios";
import "./App.css";

function App() {
  const [price, setPrice] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [chartData, setChartData] = useState(null);

// PRICE
  const getPrice = () => {
    axios
    .get("https://api.coinbase.com/v2/prices/BTC-USD/spot")
    .then((res) => {
      setPrice(res.data.data.amount);
      updateChartData(res.data.data.amount);
    })
    .catch((err) => {
      console.log(err);
    });
  };

// BALANCE
  const getWalletBalance = () => {
    const headers = {
      "X-Api-Key": process.env.REACT_APP_LNBITS_KEY
    };
    axios
      .get("https://legend.lnbits.com/api/v1/wallet", { headers })
      .then((res) => {
        //divide by 1000 to convert milisats to sats
        setBalance(res.data.balance / 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

// TRANSACTIONS
  const getTransactions = () => {
    const headers = {
      "X-Api-Key": process.env.REACT_APP_LNBITS_KEY
    };
    axios
      .get("https://legend.lnbits.com/api/v1/payments", { headers })
      .then((res) => {
        setTransactions(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

//CHART
const updateChartData = (currentPrice) => {
  const timestamp = Date.now();
  //Grab the previous state to do logic before adding new data to it
  setChartData((prevState) => {
    //If no previous state, return an array with the new price data
    if (!prevState)
      return [
        {
          x: timestamp,
          y: Number(currentPrice),
        },
      ];
      //If the timestamp or price has not changed, don't add new point to chart
      if (
      prevState[prevState.length - 1].x === timestamp ||
      prevState[prevState.length - 1].y === Number(currentPrice)
      )
    return prevState;
    //If we have a previous state, keep it and add the new price data to the end of the array
    return [
      //spread operator to keep the previous state
      ...prevState,
      {
        x: timestamp,
        y: Number(currentPrice),
      },
    ];
  });
};

// Show data on page load
  useEffect(() => {
    getPrice();
    getWalletBalance();
    getTransactions();
  }, []);

// Update Data
  useEffect(() => {
    const interval = setInterval(() => {
      getPrice();
      getWalletBalance();
      getTransactions();
    }, 5000);
    return() => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header>
        <div>
        <h1>Lightning Wallet</h1>
        <h2 className="price">BTC/USD: ${price}</h2>
        </div>
      </header>
      <Buttons/>
      <div className="row">
        <div className="balance-card">
          <h2>Your Balance</h2>
          <p>{balance} Sats</p>
        </div>

        <div className="balance-card">
          <h2>BTC/USD: ${price}</h2>
          {/* <p>${price}</p> */}
        </div>
      </div>
      <div className="row">
        <div className="row-item">
          <Transactions transactions={transactions}/>
        </div>
        <div className="row-item">
          <Chart chartData={chartData} />
          </div>
      </div>
      <footer>
        <p>Made by rz</p>
      </footer>
    </div>
  );
}

export default App;