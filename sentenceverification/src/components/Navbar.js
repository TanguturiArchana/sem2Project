import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/game.png'; 

export default function Navbar(props) {
  const [time,setTime]=useState(new Date().toLocaleTimeString());
  const getTime=()=>{
    setTime(new Date().toLocaleTimeString())
  }
  // to automatically display time
  setInterval(getTime,1000)
  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#660066' }}>
            <div className="container-fluid">
                {/* <Link className="navbar-brand fs-1 fst-italic" to="/">GoFood</Link> */}
                <Link className="navbar-brand fs-1 fst-italic" to="/">
                    <img src={logo} alt="logo" style={{ width: '5vw', height: '8vh' }} />
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                  <ul className="navbar-nav me-auto mb-2">
                    {/* <li className='nav-item'>
                      <Link className="nav-link active fs-5" aria-current="page" to="/">{props.total}</Link>
                      <Link className="nav-link active fs-5" aria-current="page" to="/">{props.current}</Link>
                    </li> */}
                    <p style={{color:"white",padding:"1%"}}>{props.total}</p>
                    <p style={{color:"white",padding:"1%"}}>{props.current}</p>
                    <p style={{color:"white",padding:"1%",textAlign:"right"}}>{props.time}</p>
                    <p style={{color:"white",padding:"1%",textAlign:"right"}}>{time}</p>
                  </ul>
                </div>
            </div>
        </nav>
    </div>
  )
}
