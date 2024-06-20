import React, { useState, useEffect } from 'react';

const PopupCard = ({ message, onClose }) => {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);

  useEffect(() => {
    if (message && message !== '' && !audioPlaying) {
      setAudioPlaying(true);
    }
  }, [message, audioPlaying]);

  useEffect(() => {
    if (audioPlaying && !audioEnded) {
      console.log('Playing audio...');
      // Simulating audio playback for demonstration purposes
      setTimeout(() => {
        console.log('Audio playback finished.');
        setAudioEnded(true);
      }, 3000); // Simulating a 3-second audio playback
    }
  }, [audioPlaying, audioEnded]);

  const handleOkButtonClick = () => {
    onClose();
  };

  return (
    <div style={styles.popupContainer}>
      <div style={styles.popup}>
        <div style={styles.popupContent}>
        
          <p>{message}</p>
          <button
            style={styles.okButton}
            onClick={handleOkButtonClick}
            disabled={!audioEnded} // Enable the button only when audioEnded is true
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

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
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  },
  popupContent: {
    textAlign: 'center',
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

export default PopupCard;
