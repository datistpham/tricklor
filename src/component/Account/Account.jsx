import React, { useState } from 'react'
import "./Account.sass"
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { Navigate, NavLink, Route, Routes } from 'react-router-dom';
import { Payment } from '../Recharge/Recharge';
import axios from 'axios'
import { SERVER_URL } from '../../config/config';

const Account = (props) => {
  return (
    <div className="wrapper-account-page">
      <div className="account-page">
        <Left {...props} />
        <Right {...props} />
      </div>
    </div>
  )
}

const Left= (props)=> {
  const array_link_account= [{text: "Thông tin cá nhân", icon: <PersonIcon />, link: "/info"}, {text: "Two-Factor Authentication (2FA)", icon: <LockIcon />, link: "/2fa"}, {text: "Đổi mật khẩu", icon: <VpnKeyIcon />, link: "/change_password"}]
  const array_link_recharge= [{text: "VIETCOMBANK", icon: "https://dongvanfb.com/_nuxt/vcb.144038a5.png", link: "/channel_1", typeIcon: "img"}]
  return (
    <div className="left-side-account">

      {
        <>
          
          {props.is_account=== true && array_link_account?.map((item, key)=> <ComponentLinkLeft type={"account"} key={key} {...item} />)}
        </>
      }
      {
        <>
          {props.is_recharge=== true && array_link_recharge?.map((item, key)=> <ComponentLinkLeft type={"recharge"} key={key} {...item} />)}
        </>
      }
    </div>
  )
}

const ComponentLinkLeft= (props)=> {
  return (
    <NavLink className={({isActive})=> isActive ? "wrapper-link-component-link-left-link wrapper-link-component-link-left-link-active" : "wrapper-link-component-link-left-link wrapper-link-component-link-left-link-inactive"} to={`/${props.type}${props.link}`}>
      <div className="component-link-left-link">
        {
          props.typeIcon=== "img" ? <div className="component-link-left-link-icon"><img alt="open" src={props.icon} className="img-component-link-left-link-icon" style={{width: 20, height: 20}} /></div> : 
          <div className="component-link-left-link-icon">{props.icon}</div>
        }
        <div className="component-link-right-link-text">{props.text}</div>
      </div>
    </NavLink>
  )
}

const Right= (props)=> {
  return (
    <div className="right-side-account">
      {
        props.is_account=== true &&
        <Routes >
          <Route path="/" element={<Navigate replace={true} to={"/account/info"} />} />
          <Route path="/info" element={<Infomation {...props} />} />
          <Route path="/2fa" element={<TwoFa {...props} />} />
          <Route path="/change_password" element={<ChangePassword {...props} />} />
        </Routes>
      }
      {
        props.is_recharge=== true &&
        <Routes >
          <Route path="/" element={<Navigate replace={true} to={"/recharge/channel_1"} />} />
          <Route path="/channel_1" element={<Payment {...props} />} />
          {/* <Route path="/channel_2" element={<TwoFa />} />
          <Route path="/channel_3" element={<ChangePassword />} /> */}
        </Routes>
      }
    </div>
  )
}

const Infomation= (props)=> {
  return (
    <div className="infomation-account">
      <Title info={"Thông tin cá nhân"} />
      <DetailInfo {...props} />
    </div>
  )
}

const DetailInfo= (props)=> {
  return (
    <div className="wrapper-detail-infomation-account">
      <div className="detail-infomation-account">
        <ComponentDetailInfo left={"Tài khoản: "} right={props.data.account} placeholder={props.data.account} readOnly={true} />
        <ComponentDetailInfo left={"Email: "} right={props.data.email} placeholder={props.data.email} readOnly={true} />
        <ComponentDetailInfo left={"Số tiền: "} right={props.data.balance} placeholder={props.data.email} readOnly={true} />
        <ComponentDetailInfo left={"Tiền khuyến mại: "} placeholder={props.data.email} right={props.data.promotion} readOnly={true} />
      </div>
    </div>
  )
}

const ComponentDetailInfo= (props)=> {
  return (
    <div className="component-detail-info-account">
      <LeftComponentDetailInfo {...props} />
      <RightComponentDetailInfo {...props} />
    </div>
  )
}

const LeftComponentDetailInfo= (props)=> {
  return (
    <div className="left-component-detail-info">
      {props.left}
    </div>
  )
}

const RightComponentDetailInfo= (props)=> {
  return (
    <div className="right-component-detail-info">
      <input onChange={(e)=> props.onChange(e.target.value)} type={props.type} className="inp-right-component-detail-info" value={props.right} readOnly={props.readOnly} placeholder={props.placeholder} />
    </div>
  )
}

export const Title= (props)=> {
  return (
    <div className="title-common">
      {props.info}
    </div>
  )
}

const TwoFa= (props)=> {
  return (
    <div className="two-fa">
      <Title info={"Two-Factor Authentication (2FA)"} />
      <div style={{textAlign: "center"}}>Tính năng đang được nâng cấp</div>
    </div>
  )
}

const ChangePassword= (props)=> {
  const [currentPassword, setCurrentPassword]= useState(()=> "")
  const [newPassword, setNewPassword]= useState(()=> "")
  const [confirmNewPassword, setConfirmNewPassword]= useState(()=> "")
  const [state, setState]= useState(()=> false)
  const [message, setMessage]= useState(()=> "")
  const changePassword= async ()=> {
    const res= await axios({
      url: `${SERVER_URL}/change_password`,
      method: 'post',
      data: {
        old_password: currentPassword,
        new_password: newPassword,
        confirmNewPassword,
        account: props.data.account
      },
      responseType: "json"
    })
    const result= await res.data
    setState(()=> result.change)
    setMessage(()=> result.message)
    setTimeout(()=> {
      if(result.change=== true ) {
        return window.location.reload()
      }
    }, 1000)
  }
  return (
    <div className="change-password">
      <Title info={"Đổi mật khẩu"} />
      <MainChangePassword {...props} currentPassword={currentPassword} newPassword={newPassword} confirmNewPassword={confirmNewPassword} setCurrentPassword={setCurrentPassword} setNewPassword={setNewPassword} setConfirmNewPassword={setConfirmNewPassword} />
      {
        <div style={{margin: "8px", fontSize: 12, color: state=== true ? "green" : "red"}}>{message}</div>
      }
      {
        currentPassword.trim().length > 0 && newPassword.trim().length > 0 && confirmNewPassword.trim().length > 0 &&
        <div className="w-btn-change-password" style={{width: "100%", display: 'flex', justifyContent: 'center', alignItems: "center", marginTop: 16}}>
          <button onClick={()=> changePassword()} className="btn-change-password" style={{height: 40, width: 200, borderRadius: 80, background: "#2e89ff", color: "#fff", fontWeight: 600, fontSize: 16, border: 'none', outline: 'none', cursor: 'pointer'}}>Cập nhật</button>
        </div>
      }
    </div>
  )
}

const MainChangePassword= (props)=> {
  
  return (
    <div className="wrapper-main-change-password">
      <div className="main-change-password">
        <ComponentDetailInfo {...props} type={"password"} value={props.currentPassword} onChange={props.setCurrentPassword} left={"Mật khẩu hiện tại: "} right={props.currentPassword} placeholder={"Mật khẩu hiện tại"} readOnly={false}  />
        <ComponentDetailInfo {...props} type={"password"} value={props.newPassword} onChange={props.setNewPassword} left={"Mật khẩu mới: "} right={props.newPassword} placeholder={"Mật khẩu mới"} readOnly={false} />
        <ComponentDetailInfo {...props} type={"password"} value={props.confirmNewPassword} onChange={props.setConfirmNewPassword} left={"Nhập lại mật khẩu mới: "} right={props.confirmNewPassword} placeholder={"Nhập lại mật khẩu mới"} readOnly={false} />
      </div>
    </div>
  )
}

export default Account