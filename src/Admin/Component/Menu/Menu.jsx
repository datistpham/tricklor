import React from 'react'
import { NavLink } from 'react-router-dom'
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentsIcon from '@mui/icons-material/Payments';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import DangerousIcon from '@mui/icons-material/Dangerous';
import "./Menu.sass"

const Menu = (props) => {
  const array_link= [{text: "Cài đặt chung", icon: <SettingsIcon />, link: "/settings"},
    {text: "Duyệt nạp tiền", icon: <PaymentsIcon />, link: "/pass_payment"},
    {text: "Thành viên", icon: <PersonOutlineOutlinedIcon />, link: "/members"},
    {text: "Thống kê", icon: <BarChartOutlinedIcon />, link: "/stats"},
    {text: "Thêm dịch vụ", icon: <AddIcon />, link: "/add_service"},
    {text: "Đăng sản phẩm", icon: <UploadIcon />, link: "/upload_product"},
    {text: "Danger zone", icon: <DangerousIcon />, link: "/danger_zone"}
    ]
  return (
    <div className="menu-admin" style={{width: 300, height: "100%"}}>
      {
        array_link.map((item, key)=> <ComponentMenu {...item} key={key} />)
      }
    </div>
  )
}

const ComponentMenu= (props)=> {
    return (
      <NavLink to={"/theta18"+ props.link} className={({isActive})=> isActive ? "component-menu-admin-active component-menu-link" : "component-menu-admin-inactive component-menu-link"}>
        <div className="component-menu-admin" style={{display: "flex", alignItems: "center", gap: 10}}>
          <div className="component-menu-admin-icon" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>{props.icon}</div>
          <div className="component-menu-admin-text">{props.text}</div>
        </div>
      </NavLink>
    )
}


export default Menu