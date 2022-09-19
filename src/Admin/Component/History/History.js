import { Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { SERVER_URL } from '../../../config/config'
import { useInView } from "react-intersection-observer"
import { DetailStats1 } from '../../../component/History/DetailOrder'

const History = (props) => {

  const [history, setHistory]= useState(()=> [])
  useEffect(()=> {
    (async()=> {
        const res= await axios({
            url: `${SERVER_URL}/ad/history`,
            method: "post",
            responseType: "json"
        })
        const result= await res.data.data
        return setHistory(()=> result)
    })()
  }, [])
  const [search, setSearch]= useState(()=> "")
  const [dataSearch, setDataSearch]= useState(()=> [])
  const [isSearch, setIsSearch]= useState(()=> false)
  const searchReceipt= async ()=> {
    const res= await axios({
        url: `${SERVER_URL}/find/history`,
        method: "get",
        params: {
            search
        },
        responseType: "json"
    })
    setIsSearch(()=> true)
    const result= await res.data
    return setDataSearch(()=> result.search)
  }
  return (
    <div>
        <div style={{margin: "16px 0", fontSize: 20, fontWeight: 600}}>Lịch sử nạp của thành viên</div>
        <div>Tìm kiếm đơn hàng bằng mã hóa đơn</div>
        <div style={{margin: "16px 0", display: "flex", alignItems: "center", gap: 16}}>
            <input onChange={(e)=> {
                if(e.target.value.length <=0 ) {
                    setIsSearch(()=> false)
                }
                setSearch(e.target.value)
            }} placeholder={"Nhập mã hóa đơn"} type="text" style={{height: 50, borderRadius: 80, outlineColor: "#2e89ff", fontSize: 18, maxWidth: 600, width: "100%", padding: 10}} />
            {search.length > 0 && <Button onClick={()=> searchReceipt()} variant={"contained"} style={{borderRadius: 80, height: 50}}>Tìm kiếm</Button>}
        </div>
        <div className="w-table-of-history-ad" style={{width: "100%", overflowX: "auto"}}>
            <table cellSpacing={0} className="table-of-history-ad" style={{width: "100%"}}>
                <thead className="thead-table-of-history-ad" >
                    <tr className="th-thead-table-of-history-ad">
                        <th>Mã hóa đơn</th>
                        <th>Tên tài khoản</th>
                        <th>Số tiền</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody className="tbody-table-of-history-ad">
                    {
                        isSearch=== false && history?.map((item, key)=> <tr key={key} className="tr-tbody-table-of-history-ad">
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.code_stats}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}><NameAccount id_user={item.id_user} /></td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.amount}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.date}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.state=== true ? <span style={{color: "green"}}>Thành công</span> : <span style={{color: "red"}}>Thất bại</span>}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>
                            <DetailStats {...item} account={item.info.account} password={item.info.password || item.password} code_stats={item.code_stats} />
                        </td>
                    </tr>)
                    }
                    {
                        isSearch=== true && dataSearch?.map((item, key)=> <tr key={key} className="tr-tbody-table-of-history-ad">
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.code_stats}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}><NameAccount id_user={item.id_user} /></td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.amount}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.date}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>{item.state=== true ? <span style={{color: "green"}}>Thành công</span> : <span style={{color: "red"}}>Thất bại</span>}</td>
                        <td style={{textAlign: "center", border: "1px solid #fff"}}>
                            <DetailStats {...item} account={item.info.account} password={item.info.password || item.password} code_stats={item.code_stats} />
                        </td>
                    </tr>)
                    }
                
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default History

const NameAccount= (props)=> {
    const { ref, inView }= useInView()
    const [data, setData]= useState(()=> "")
    useEffect(()=> {
        if(props && inView=== true) {

            (async()=> {
                const res= await axios({
                    url: `${SERVER_URL}/get/account`,
                    method: "get",
                    params: {
                        id_user: props?.id_user
                    },
                    responseType: "json"
                })
                const result= await res.data
                return setData(()=> result.account)
            })()
        }
    })
    return (
        <span ref={ref}>{data}</span>
    )
}

const DetailStats= (props)=> {
    const [open, setOpen]= useState(()=> false)
    const handleClose= ()=> {
        setOpen(()=> false)
    }
    return (
        <>
            <Button onClick={()=> setOpen(()=> true)} variant={"contained"}>Chi tiết</Button>
            <DetailStats1 {...props} open={open} handleClose={handleClose} />
        </>
    )
}