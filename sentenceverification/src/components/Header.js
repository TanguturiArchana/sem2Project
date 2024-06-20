import React from 'react'



export default function Header(props) {
  return (
    <div style={{height:"1%",width:"100%", backgroundColor: '#660066',padding:"0.5%",textAlign:"center" }}>
    <p style={{color:"white",paddingLeft:"1%"}}>{props.total}</p>
    <p style={{color:"white",paddingLeft:"1%"}}>{props.current}</p>
    
    </div>
  )
}
