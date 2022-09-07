import { Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { SERVER_URL } from '../../../config/config'
import Alert from '../Alert/Alert'

const Member = (props) => {
  const [data, setData]= useState(()=> [])
  useEffect(()=> {
    (async()=> {
      const res= await axios({
        url: `${SERVER_URL}/get_user`,
        method: "get",
        responseType: "json",

      })
      const result= await res.data
      return setData(()=> result.data)
    })()
  }, [])
  return (
    <div className="member-stat" style={{width: "100%"}}>
      {
        data?.map((item, key)=> <ComponentMember key={item._id} {...item} />)
      }
    </div>
  )
}

const ComponentMember= (props)=> {
  const [ok, setOk]= useState(()=> false)
  const [message, setMessage]= useState(()=> "")
  const [password, setPassword]= useState(()=> "")
  const resetPassword= async ()=> {
    const res= await axios({
      url: `${SERVER_URL}/reset/password`,
      method: "post", 
      data: {
        id_user: props.id_user,
        new_password: password
      }
    })
    const result= await res.data
    setPassword(()=> "")
    setOk(()=> true)
    setMessage("Đặt lại mật khẩu thành công")
    setTimeout(()=> {
      setOk(()=> false)
      setMessage(()=> "")
    }, 2500)
  }
  return (
    <div className="component-member" style={{width: "100%", marginBottom: 30, paddingBottom: 16, borderBottom: "1px solid #e7e7e7"}}>
      <div>Tài khoản: <strong><input type="text"value={props.account} style={{fontSize: 18}} /></strong></div>
      <br />
      <div>Số tiền: <strong><input type="text"value={props.balance} style={{fontSize: 18}} /></strong></div>
      <br />
      <div>Email: <strong><input type="text"value={props.email} style={{fontSize: 18}} /></strong></div>
      <br />
      <div>Đặt lại mật khẩu: </div>
      <div style={{display: "flex", alignItems: "center", gap: 10}}>
        <input onChange={(e)=> setPassword(e.target.value)} type="text" placeholder="Nhập mật khẩu mới" style={{fontSize: 18}} />
        <Button onClick={()=> resetPassword()} variant={"contained"}>Đặt lại</Button>
      </div>
      <Alert duration={2500} message={message} open={ok} />
    </div>
  )
}

export default Member