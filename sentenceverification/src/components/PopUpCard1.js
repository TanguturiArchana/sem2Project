import React from 'react'
import Glitter from '../images/Glitter.gif'

export default function PopUpCard1({message, close, attempts,a}) {
  const handleOkButtonClick=()=>{
    close();

  }
  return (
    <div style={styles.popupContainer}>
      <div style={styles.popup}>
        <div style={styles.popupContent}>
          <p>{message}</p>
          <button
            style={styles.okButton}
            onClick={handleOkButtonClick}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
const styles = {
  popupContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
   
  },
  popup: {
    backgroundColor: '#F0F8FF',
    backgroundImage:`url(${Glitter})`,
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  popupContent: {
    textAlign: 'center',
    fontWeight:'bold',
    color:'black',
    marginTop:"4%"
  },
  image: {
    maxWidth: '100%',
    maxHeight: 200,
    marginBottom: 10,
  },
  okButton: {
    backgroundColor: '#660066',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
};



