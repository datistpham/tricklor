import React from "react";
import { useState } from "react";
import axios from "axios"
import { SERVER_URL } from "../../../config/config";

const PassPayment = (props) => {
  const [account, setAccount]= useState(()=> "")
  const [recharge, setRecharge]= useState(()=> 0)
  const [message, setMessage]= useState(()=> "")
  const [state, setState]= useState(()=> false)
  const rechargeManual= async ()=> {
    const res= await axios({
        url: `${SERVER_URL}/recharge/manual`,
        method: "post", 
        responseType: "json",
        data: {
            account, recharge
        }
    })
    const result= await res.data
    if(result.recharge=== true ) {
        setMessage(()=> "Nạp tiền thành công")
        setState(()=> true)
        setTimeout(()=> {
            setMessage(()=> "")
        }, 3000)
    }
    else {
        setMessage(()=> "Nạp tiền thất bạt")
        setState(()=> false)
        setTimeout(()=> {
            setMessage(()=> "")
        }, 3000)
    }
  }
  return (
    <div className="pass-payment">
      <div>Nhập tên tài khoản cần nạp: </div>
      <div className="pass-payment-need-recharge">
        <input
          value={account}
          onChange={(e)=> setAccount(e.target.value)}
          type="text"
          className="pass-payment-need-recharge-inp"
          style={{
            height: 40,
            fontSize: 18,
            padding: 5,
            border: "none",
            outline: "none",
          }}
        />
      </div>
      <br />
      <div>Nhập số tiền muốn nạp: </div>
      <div className="pass-payment-need-amount">
        <div className="pass-payment-need-recharge">
          <input
            value={recharge}
            onChange={(e)=> setRecharge(e.target.value)}
            type="number"
            className="pass-payment-need-recharge-inp"
            style={{
              height: 40,
              fontSize: 18,
              padding: 5,
              border: "none",
              outline: "none",
            }}
          />
        </div>
      </div>
      <div className="message-update-success" style={{margin: "16px 0", fontSize: 14, color: state=== true ? "green" : "red"}}>{message}</div>
      <div className="btn-payment-need" style={{padding: "10px 0"}}>
        <button onClick={()=> rechargeManual()} className="btn-payment-main-need" style={{background: "#2e89ff", padding: "10px 30px", color: "#fff", border: "none", outline: "none", borderRadius: '80px', cursor: "pointer", fontSize: 18}}>Nạp</button>
      </div>
    </div>
  );
};

export default PassPayment;