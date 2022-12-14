import { Slide } from '@mui/material'
import DoneIcon from '@mui/icons-material/Done';
import { useEffect, useRef, useCallback, useContext } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { memo } from 'react';
import { SocketContext } from '../../../App';

const PaymentSuccessAlert = memo((props) => {
  const { lang }= useContext(SocketContext)
  const ref= useRef()
  const clickOutside= useCallback((e)=> {
    if(ref.current && !ref.current.contains(e.target)) {
        props?.setChecked(()=> false)    
    }
  }, [props])
  useEffect(()=> {
    document.addEventListener("mousedown", clickOutside)
    return ()=> document.removeEventListener("mousedown", clickOutside)
  }, [clickOutside])
  useEffect(()=> {
    setTimeout(()=> {
      props?.setChecked(()=> false)
    }, 100000)
  }, [props])

  return (
    <div className={"payment-success-alert"}>
      <Slide direction="up" in={props?.checked} mountOnEnter unmountOnExit>
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", position: "fixed", top: 0, left: 0, zIndex: 29, background: "rgba(0, 0, 0, 0.5)", width: "100%", height: "100%"}}>
          <div ref={ref} style={{backgroundColor: "#fff", borderRadius: 10, boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px", padding: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexDirection: "column", width: "100%", maxWidth: 360}}>
            <div style={{width: "100%", display: "flex", justifyContent: "end", alignItems: "center"}}>
              <CloseIcon onClick={()=> props?.setChecked(()=> false) } style={{width: 36, height: 36, borderRadius: "50%", backgroundColor: "#f2f0f5", display: "flex", justifyContent: 'center', alignItems: "center", cursor: "pointer"}} />
            </div>
            <div className={"wrap-icon-success-payment-done"}>{<DoneIcon style={{width: 24, height: 24, color: "green"}} />}</div>
            <div style={{display: "flex", fontSize: 18, fontWeight: 600}}>{lang=== "vn" ? "Nạp tiền thành công" : "Payment success"}</div>
          </div>
        </div>
      </Slide>
    </div>
  )
})

export default PaymentSuccessAlert