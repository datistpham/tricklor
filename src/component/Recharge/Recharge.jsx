import React, { memo, useEffect, useState } from 'react'
import { Title } from '../Account/Account'
import NumberFormat from 'react-number-format';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import "./Recharge.sass"
// import axios from 'axios';
import { SERVER_URL } from '../../config/config';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PersonIcon from '@mui/icons-material/Person';
import PaidIcon from '@mui/icons-material/Paid';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import Cookie from "js-cookie"
import NotesIcon from '@mui/icons-material/Notes';
import { CircularProgress, Dialog, DialogContent, DialogContentText } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import Transition from '../../ThirdParty/Transition';
import { useContext } from 'react';
import { SocketContext } from '../../App';

export const Payment= (props)=> {
  const { lang }= useContext(SocketContext)
  return (
    <div className="payment" >
      <Title info={<div>{lang=== "vn" ? "Nạp tiền thông qua ngân hàng" : "Payment via bank"} <span style={{fontSize: 30, textTransform: "uppercase"}}>{props?.name_bank}</span></div>} />
      <MainPayment {...props} />
    </div>
  )
}


const MainPayment= (props)=> {
  return (
    <div className="main-payment">
      <LogoBanking logo={props.logo_bank} />
      <ProBanking {...props} />
    </div>
  )
}

const LogoBanking= (props)=> {
  return (
    <div className="wrapper-logo-banking-main-payment">
      <div className="logo-banking-main-payment">
        <img src={props.logo} alt="open" className="logo-banking-main-payment-img" />
      </div>
    </div>
  )
}

const ProBanking= (props)=> {
  const [amount, setAmount]= useState(0)
  return (
    <div className="pro-banking-main-payment">
      <Pro1 setAmount={setAmount} />
      <Pro2 {...props} setAmount={setAmount} amount={amount} />
      {/* <PromotionTable /> */}
      <ContactSupport />
    </div>
  )
}

const Pro1= (props)=> {
  const { color_code, lang }= useContext(SocketContext)

  return (
    <div className="pro-1-banking-main-payment">
      <span className="pro-1-banking-main-payment-span" style={{color: color_code}}>{lang==="vn" ? "Nhập số tiền cần nạp: " : "Typing money recharge: "}</span>
      <div className="pro-1-banking-main-payment-div">
        <NumberFormat onValueChange={(e)=> props.setAmount(parseInt(e.value))} thousandSeparator={true} displayType={"input"} placeholder={lang=== "vn" ? "Nhập số tiền cần nạp" : "Typing money recharge: "} className="pro-1-banking-main-payment-div-inp" />
        <div className="pro-1-banking-main-payment-div-div" style={{background: color_code}}>VND</div>
      </div>
    </div>
  )
}

const Pro2= (props)=> {
  // const preparePayment= async ()=> {
  //   const res= await axios({
  //     url: `${SERVER_URL}/create_payment_url`,
  //     method: "post",
  //     responseType: "json",
  //     data: {
  //       amount: props.amount,
  //       bankCode: "MB",
  //       orderDescription: "Nap tien"
  //     }
  //   })
  //   const result= await res.data
  //   return console.log(result)
  // }
  const [open, setOpen]= useState(()=> false)
  const { color_code, lang }= useContext(SocketContext)

  return (
    <div className="button-payment" style={{position: "relative"}}>
      <button disabled={parseInt(props.amount) <=0 || isNaN(props.amount) ? true : false} style={{opacity: parseInt(props.amount) <=0 || isNaN(props.amount) ? 0.5 : 1, cursor: parseInt(props.amount) <=0 || isNaN(props.amount) ? "not-allowed" : "pointer", background: color_code}} title={parseInt(props.amount) <= 0 || isNaN(props.amount) ? (lang=== "vn" ? "Vui lòng nhập giá tiền hợp lệ" : "Please type valid amount") : (lang=== "vn" ? "Thanh toán" : "Pay") } onClick={()=> setOpen((prev)=> !prev)} className="button-payment-main">
       {
        lang=== "vn" ? " Thanh toán" : "Pay"
       }
      </button>
      {
        open=== true && <PopupPayment setOpen={setOpen} {...props} />
      }
    </div>
  )
}

const PopupPayment= (props)=> {
  const { setCallAgain }= useContext(SocketContext)
  useEffect(()=> {
    document.body.style.overflow= "hidden"
    return ()=> document.body.style.overflow= "auto"
  }, [])
  useEffect(()=> {
    const timeoutId= setTimeout(()=> {
      props.setOpen(()=> false)
    }, 1000 * 600)
    return ()=> {
      clearTimeout(timeoutId)
    }
  }, [])
  const [statePayment, setStatePayment]= useState(()=>( {status: false}))
  useEffect(()=> {
    if(statePayment?.status=== false) {
      const intervalId= setInterval(async ()=> {
        const res= await axios({
          url: `${SERVER_URL}/check/payment`,
          method: "post",
          responseType: "json",
          data: {
            id_user: Cookie.get("uid"),
            balance: parseInt(props.data.balance),
            content: props.data.account,
            recharge: parseInt(props?.amount),
            api_payment: props?.api_payment
          }
        })
        const result= await res.data
        setStatePayment(()=> result)
      }, 3000)
      
      return ()=> {
        clearInterval(intervalId)
      }
    }
    if(statePayment?.status=== true ) {
      setCallAgain(prev=> !prev)
      setTimeout(()=> {
        props.setOpen(()=> false)
      }, 3000)
    }
    
  }, [props.data.balance, props.data.account, props?.amount, statePayment, props, setCallAgain])
  return (
    <div className="popup-payment-wrapper" style={{width: "100%", height: "100%", background: "rgba(255, 255, 255, 0.75)", position: "fixed", top: 0, left: 0, display: "flex", justifyContent: 'center', alignItems: "center"}}> 
      <div className="popup-payment" style={{width: 800, height: "auto", borderRadius: 10, background: "#fff", boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", overflow: "hidden", padding: 10, display: "flex", justifyContent: "space-between", position: "relative"}}>
        <div onClick={()=> props.setOpen(()=> false)} style={{display: "flex", justifyContent: "center", alignItems: "center", position: "absolute", right: 0, top: 0}}>
          <CloseIcon style={{width: 32, height: 32, cursor: "pointer"}} />
        </div>
        <LeftPopup {...props} statePayment={statePayment} />
        <RightPopup {...props} />
      </div>
    </div>
  )
}

const LeftPopup= memo((props)=> {
  const { lang }= useContext(SocketContext)
  return (
    <div className="left-popup-payment-wrapper" style={{width: 300, height: "auto"}}>
      <img src={props.logo} alt="open" style={{width: "100%", height: 100}} />
      <div className="" style={{ margin: "16px 0"}}>
        <strong style={{fontSize: 20, fontWeight: 600, textTransform: "uppercase", textAlign: "center"}}>{lang=== "vn" ? "Thông tin nạp tiền" : "Infomation of recharge"}</strong>
      </div>
      <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10}}>
        <WrapIcon icon={<AccountBalanceIcon style={{color: "#04a468"}}/>} /><div>{lang==="vn" ? "Ngân hàng: ": "Bank: "}<strong >{props.name_bank}</strong></div>
      </div>
      <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10}}>
        <WrapIcon icon={<CreditCardIcon style={{color: "#04a468"}}/>} /><div>{lang=== "vn" ? "Số tài khoản: ": "Account number: "}<strong >{props.bank_account}</strong></div>
      </div>
      <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10}}>
        <WrapIcon icon={<PersonIcon style={{color: "#04a468"}}/>} /><div>{lang=== "vn" ? "Chủ tài khoản: " :"Account holder: "}<strong >{props.name_bank_account}</strong></div>
      </div>
      <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
        <WrapIcon icon={<PaidIcon style={{color: "#04a468"}}/>} /><div>{lang=== "vn" ? "Số tiền cần thanh toán: ": "Amount to be paid: "}<strong ><NumberFormat thousandSeparator={true} suffix={"đ"} value={props.amount} displayType={"text"} /></strong></div>
      </div>      
        <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
          <WrapIcon icon={<ChatBubbleIcon style={{color: "#04a468"}}/>} /><div>{lang=== "vn" ? "Nội dung chuyển khoản: " : "Transfer content: "}<strong >{props.data.account}</strong></div>
        </div>
      
      {
        props?.statePayment?.status=== false &&
        <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
          <WrapIcon icon={<NotificationsIcon style={{color: "#04a468"}}/>} /><div>{lang=== "vn" ? "Trạng thái: " : "Status: "}<strong ><CircularProgress style={{width: 14, height: 14}} /> {lang=== "vn" ? "Đang chờ thanh toán" : "Pending"}</strong></div>
        </div>
      }
      {
        props?.statePayment?.status=== true &&
        <>
          <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
            <WrapIcon icon={<NotificationsIcon style={{color: "#04a468"}}/>} /><div>Trạng thái: <strong ><DoneIcon style={{width: 14, height: 14}} /> {lang=== "vn" ? "Thanh toán thành công" :"Pay success"}</strong></div>
            <AlertPaymentSuccess open={props?.statePayment?.status} />
          </div>
        </>
      }
      <div style={{padding: "16px 0",width: "100%", paddingBottom: "5px", borderBottom: "1px solid #e7e7e7", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap"}}>
        <WrapIcon icon={<NotesIcon style={{color: "#04a468"}} />} /><div>Note: <strong style={{wordBreak: "break-word"}}>{lang=== "vn" ? "Popup tự động tắt khi giao dịch thành công hoặc sẽ sau 10 phút nếu giao dịch chưa phản hồi" : "Popup will automatically turn off when payment is success or after 10 minutes if transation not respond."}</strong><br /><div><strong>{lang=== "vn" ? "Nếu bạn đã thanh toán nhưng không nhận được xu vui lòng liên hệ admin để được hỗ trợ ( có thể chụp thêm bill ) " : "If you not paid but not received coin, please contact admin to support (you can add bill pay)"}</strong></div></div>
      </div>
    </div>
  )
})

const WrapIcon= (props)=> {
  return (
    <div style={{width: 16, height: 16, display: "flex", justifyContent: "center", alignItems: "center"}}>{props.icon}</div>
  )
}

const RightPopup= (props)=> {
  const  {lang }= useContext(SocketContext)
  return (
    <div className="right-popup-payment-wrapper" style={{width: "calc(100% - 300px)", height: "auto"}}>
      <div className={""} style={{fontSize: 24, fontWeight: 600, textAlign: "center"}}>{lang=== true ? "Quét mã Qr để thanh toán" : "Scan Qr code to pay"}</div>
      <div style={{margin: "16px 0"}}>
        <img src={`https://img.vietqr.io/image/${props.name_bank}-${props.bank_account}-compact2.jpg?accountName=${props.name_bank_account}&amount=${props.amount}&addInfo=${props.data.account}`} alt="open" />
      </div>
    </div>
  )
}

export const PromotionTable= (props)=> {
  return (
    <div className="promotion-table" style={{opacity: 0}}>
      <div className="promotion-table-title">Khuyến mãi nạp tiền</div>
      <ListPromotion speaker={<VolumeUpIcon style={{color: "#007c30"}} />} text={"Từ 0 đến 100k + 30% giá trị thẻ nạp"} />
    </div>
  )
}

const ListPromotion= (props)=> {
  return (
    <div className="list-promotion">
      <DetailPromotion {...props} />
      <DetailPromotion {...props} />
      <DetailPromotion {...props} />
    </div>
  )
}

const DetailPromotion= (props)=> {
  return (
    <div className="wrapper-element-promotion">
      <div className="speaker-promotion">{props.speaker}</div>
      <div className="text-promotion">{props.text}</div>
    </div>
  )
}

export const ContactSupport= (props)=> {
  const { lang }= useContext(SocketContext)
  return (
    <div className="contact-support">
      <ContactSupport1 content={lang=== "vn" ? "Vui lòng nhập chính xác nội dung chuyển khoản để hệ thống kiểm tra và kích hoạt tự động. Tài khoản của bạn sẽ được cộng tiền sau 1 dến 5 phút." 
      : "Please type correct transfer content to system check and automatic activation"} />
      <ContactSupport1 />
    </div>
  )
}

const ContactSupport1= (props)=> {
  const { color_code }= useContext(SocketContext)
    
  return (
    <div className="contact-support-1" style={{color: color_code}}>
      {props.content}
    </div>
  )
}

const AlertPaymentSuccess= (props)=> {
  const { lang }= useContext(SocketContext)
  return (
    <Dialog
        open={props.open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {lang=== "vn" ? "Thanh toán thành công" : "Pay success"}
          </DialogContentText>
        </DialogContent>
      </Dialog>
  )
}