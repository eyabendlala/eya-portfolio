import React from "react";

const SocieteCard = ({logo, nom}) =>{
    return(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: 'white', width: '160px', height: 'auto', borderRadius: '5px', marginRight:'15px', marginLeft:'15px' }}>
            <div style={{ flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop:'5px', marginBottom:'10px'}}>
                {logo !== null ? (
                    <img src={logo} alt="Societe Logo" style={{ maxWidth:'80px', maxHeight:'80px', borderRadius:'50%' }} />
                ) : (
                    <div style={{ width:'80px', height:'80px', backgroundColor:'gray', borderRadius:'50%' }}></div>
                )}
            </div>
            <span style={{ color: 'black' }}> {nom} </span>
            <span className="badge badge-dark" style={{marginBottom:'5px'}}>0 Opening</span>
        </div>
    )
}   

export default SocieteCard;