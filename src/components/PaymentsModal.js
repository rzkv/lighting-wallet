import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import "./PaymentsModal.css";

const customStyles = {
  content: {
    top: "20%",
    left: "40%",
    right: "40%",
    bottom: "auto",
  },
};

const PaymentsModal = ({ modalState, setModalState }) => {
  //Our state for the info we will send to either generate a new invoice or pay an invoice
  const [formData, setFormData] = useState({
    amount: 0,
    invoiceToPay: "",
  });
  //Our state for storing the invoice we generate to be paid
  const [invoice, setInvoice] = useState("");
  //Our state for the invoice we paid
  const [PaymentInfo, setPaymentInfo] = useState({
    payment_hash: "",
    chekingID: "",
  });

//HAND SEND
  const handleSend = (e) => {
    //keep the page from refreshing when the form is submitted
    e.preventDefault();

    const headers = {
      "X-Api-Key": process.env.REACT_APP_LNBITS_KEY
    };
    const data = {
      bolt11: formData.invoiceToPay,
      out: true,
    };
    axios
      .post("https://legend.lnbits.com/api/v1/payments", data, { headers })
      .then((res) => {
        setPaymentInfo({
          payment_hash: res.data.payment_hash,
          checkingID: res.data.checking_id,
        })
      })
      .catch((err) => console.log(err));
    return;
  };

//HAND RECIEVE
  const handleRecieve = (e) => {
    //keep the page from refreshing when the form is submitted
    e.preventDefault();

    const headers = {
      "X-Api-Key": process.env.REACT_APP_LNBITS_KEY
    };
    const data = {
      amount: formData.amount,
      out: false,
      //TODO: Add additional form for use to be able to customizxe the memo
      memo: "LNBits",
    };
    axios
      .post("https://legend.lnbits.com/api/v1/payments", data, { headers })
      .then((res) => setInvoice(res.data.payment_request))
      .catch((err) => console.log(err));
    return;
  };

//CLEAR STATE when modal closed
const clearForms = () => {
    setModalState ({
        type: "",
        open: false,
    });
    setInvoice("");
    setPaymentInfo({
        payment_hash: "",
        chekingID: "",
    });
    setFormData({
        amount: 0,
        invoiceToPay: "",
    });
};

  return (
    <Modal
      isOpen={modalState.open}
      style={customStyles}
      contentLabel="Example Modal"
      appElement={document.getElementById("root")}
    >
      <p
        className="close-button"
          onClick = {() => {
            clearForms();
        }}
      >
        X
      </p>
      {/* If it is a send */}
      {modalState.type === "send" && (
        <form>
          <label>Paste an invoice</label>
          <input
            type="text"
            value={formData.invoiceToPay}
            onChange={(e) =>
              setFormData({ ...formData, invoiceToPay: e.target.value })
            }
          />
          <button className="button" onClick={(e) => handleSend(e)}>
            Send
          </button>
        </form>
      )}
      {/* If it is a recieve */}
      {modalState.type === "recieve" && (
        <form>
          <label>Amount</label>
          <input
            type="number"
            min="0"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
          <button className="button" onClick={(e) => handleRecieve(e)}>
            Submit
          </button>
        </form>
      )}
      {/* If we are displaying our newly created invoice */}
      {invoice && (
        <section>
          <h3>Invoice Created</h3>
          <p>{invoice}</p>
          {/* TODO: Create a QR code out of this invoice and display it */}
        </section>
      )}
      {/* If we are displaying the status of our successful payment */}
      {PaymentInfo.payment_hash && (
        <section>
          <h3>Payment Successful</h3>
          <p>Payment Hash: {PaymentInfo.payment_hash}</p>
          <p>Checking ID: {PaymentInfo.checkingID}</p>
        </section>
      )}
    </Modal>
  );
};

export default PaymentsModal;
