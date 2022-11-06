import React from 'react'
import Tilt from 'react-parallax-tilt';
import cirno from './cirno.png'
import './Logo.css'

const Logo = () =>{
    return(
    <div className='ma4 mt0'>
        <Tilt className="Tilt br1 shadow-2" options={{ max : 25 }} style={{ height: 100, width: 100 }}>
        <div>
        <h1><img style={{paddingTop:'10px'}} alt='logo' src={cirno}/></h1>
        </div>
        </Tilt>
    </div>
    )
}
export default Logo;