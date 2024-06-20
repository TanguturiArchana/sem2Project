import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import PopupCard from './PopupCard';
import file from './questions.json';
import correctAudio from './correct.mp3';
import playIconClicked from './playIcon.png';
import playIcon from './playIconClicked.jpg';


export default function Main() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [attempts, setAttempts] = useState(Array(file.images["section-1"].length).fill(0)); 
  const [times, setTimes] = useState(Array(file.images["section-1"].length).fill(0)); 
  const [timerRunning, setTimerRunning] = useState(true);
  const [popupMessage, setPopupMessage] = useState("");
  const [currentAudioButton, setCurrentAudioButton] = useState(null); 
  const [lastPopupDisabled, setLastPopupDisabled] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false); 
  const [disabledElements, setDisabledElements] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState(Array(file.images["section-1"].length).fill('white'));
  const [optionStatus, setOptionStatus] = useState(Array(file.images["section-1"].length).fill(null));
  const [showCongratulations, setShowCongratulations] = useState(false); // State to track whether to show the congratulations message

  const getOptionBackgroundColor = (index) => {
    if (optionStatus[index] === null) {
      return 'white'; // Default color
    } else {
      return optionStatus[index] ? 'lightgreen' : 'white'; 
    }
  };
  
  useEffect(() => {
    let startTime = 0;
    let interval = 0;
    if (currentIndex >= 0 && currentIndex < file.images["section-1"].length && timerRunning) {
      startTime = Date.now();
      interval = setInterval(() => {
        const newTimes = [...times];
        newTimes[currentIndex] = Math.floor((Date.now() - startTime) / 1000);
        setTimes(newTimes);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentIndex, timerRunning, times]);

  useEffect(() => {
    if (showPopup && popupMessage) {
      speak(popupMessage);
    }
  }, [showPopup, popupMessage, selectedOption]); 

  useEffect(() => {
    if (audioPlaying) {
      setDisabledElements(true);
    } else {
      setDisabledElements(false);
    }
  }, [audioPlaying]);
  useEffect(() => {
    // Initialize background color to white whenever currentIndex changes
    setBackgroundColor(Array(file.images["section-1"].length).fill('white'));
  }, [currentIndex]);
  

  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    const currentData = file.images["section-1"][currentIndex];
    if (selectedOption === null) {
      setShowPopup(true);
      setPopupMessage("Please choose an option.");
      return;
    } else if (selectedOption === currentData.correctanswer) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < file.images["section-1"].length) {
        setCurrentIndex(nextIndex);
      } else {
        setCompleted(true);
        setTimerRunning(false);
        setShowCongratulations(true); // Show congratulations message when section one is completed
      }
    } else {
      const newAttempts = [...attempts];
      newAttempts[currentIndex]++;
      setAttempts(newAttempts);
      setShowPopup(true);
      setPopupMessage("Wrong answer! Please choose the correct one.");
      if (audioPlaying) {
        setAudioPlaying(false);
      }
    }
  };
  
  const handleCheckboxChange = (option,index) => {
    setSelectedOption(option);
    const currentData = file.images["section-1"][currentIndex];
    if (option === currentData.correctanswer) {
      const audio = new Audio(correctAudio);
      audio.play();
      audio.onended = () => {
        setAudioPlaying(false);
        setDisabledElements(false);
        const isCorrect = option === currentData.correctanswer;
        const newOptionStatus = [...optionStatus];
        newOptionStatus[index] = isCorrect;
        setOptionStatus(newOptionStatus);
        if (isCorrect) {
          setTimeout(() => {
            newOptionStatus[index] = null;
            setOptionStatus(newOptionStatus);
          }, 1000);
        }
      };
      setAudioPlaying(true);
      setDisabledElements(true);
    } else {
      setAudioPlaying(false);
      setDisabledElements(false);
    }
  };
  
  const handlePlayClick = (option) => {
    speak(option);
    setCurrentAudioButton(option);
    setAudioPlaying(true);
    setDisabledElements(true);
  
    if (currentAudioButton === option && audioPlaying) {
      setAudioPlaying(false);
      setDisabledElements(false);
      setCurrentAudioButton(null);
    } else {
      const audio = new Audio(correctAudio);
      audio.play();
      audio.onended = () => {
        setAudioPlaying(false);
        setDisabledElements(false);
        setCurrentAudioButton(null);
      };
    }
  };
  

  const handleNextButtonClick = () => {
    handleNext();
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    setPopupMessage("");
    if (completed) setTimerRunning(false);
    if (completed && lastPopupDisabled) setLastPopupDisabled(false);
  };

  const handleLastPopupClose = () => {
    setShowPopup(false);
    setCompleted(false);
    setLastPopupDisabled(true);
    if (currentIndex === file.images["section-1"].length) {
      setPopupMessage("Section-1 completed successfully!");
      setShowPopup(true);
      setCompleted(true);
      
    }
  };

  const currentData = file.images["section-1"][currentIndex];

  return (
    <div>
      <Navbar />
      {showPopup && !selectedOption && <PopupCard message={popupMessage} onClose={handlePopupClose} />}
      {showPopup && selectedOption && <PopupCard message={popupMessage} onClose={handlePopupClose} />}
      {completed && (
        <PopupCard
          message={file.images["section-1"].map((data, index) => (
            <div key={index}>
              <p>Attempts for Question {index + 1}: {attempts[index]}</p>
              <p>Time taken for Question {index + 1}: {times[index]} seconds</p>
            </div>
          ))}
          onClose={handleLastPopupClose}
          disabled={lastPopupDisabled} 
        />
      )}

      
      <div style={{ textAlign: "center", backgroundColor: "#CBC3E3",border: '4px solid #660066', padding: "0.2%",margin:"3%", borderRadius: "2%",height:"25%",width:"94%" ,}}>
        {currentData && (
          <div style={{ textAlign: "center" }}>
            <div style={{textAlign: "center",height: "25%", width: "50%", marginLeft: "24%",marginTop:"1%"}}>
            
            <img src={currentData.url} alt={currentData.caption} style={{ height: "25%", width: "30%" }} />
            <p>Choose the passage that matches the picture:</p>
            </div>
            <div style={{ textAlign: "left", margin: "2%"}}>
              {currentData.options.map((option, index) => (
                <div style={{
                    padding: "1%",
                    backgroundColor: getOptionBackgroundColor (index),
                    border: '4px solid #660066',
                    borderRadius:"2%",
                    margin: "2%",
                  }} key={index}>
                  <img
                    src={currentAudioButton === option && audioPlaying ? playIconClicked : playIcon}
                    alt="Play Audio"
                    onClick={() => handlePlayClick(option)}
                    style={{ cursor: "pointer", marginRight: "10px", height: "3%", width: "3%" }}
                    className="audio-image"
                    disabled={disabledElements}
                  />
                  <input
                    type="checkbox"
                    id={`option${index + 1}`}
                    name={`option${index + 1}`}
                    checked={selectedOption === option}
                    onChange={() => handleCheckboxChange(option,index)}
                    disabled={disabledElements}
                    style={{ transform: "scale(1.5)" }}
                  />
                  <label htmlFor={`option${index + 1}`} style={{ marginLeft: "5px",color:"black", }}>{option}</label>
                </div>
              ))}
            </div>
          </div>
        )}

        {!completed && <button disabled={!selectedOption || disabledElements} onClick={handleNextButtonClick} style={{ margin: '0 auto', display: 'block' ,backgroundColor: '#660066',color: '#fff',border: 'none',padding: '10px 20px',borderRadius: 5,cursor: 'pointer',fontSize: 16,fontWeight: 'bold',marginTop: 20,}} id="next-button">Next</button>}

      </div>
    </div>
  );
}
// // backgroundImage:`url(${bordergif})`,backgroundSize: 'contain',backgroundRepeat: 'no-repeat',backgroundPosition: 'center',
// import React, { useEffect, useState } from 'react'
// // import Navbar from './Navbar'
// import file from './questions.json';
// import Header from './Header';
//  import PopUpCard1 from './PopUpCard1';
// import Option from './Option';
// import Congratulations from './congratulationsGif.gif'


// export default function Game() {
//     const sections = Object.keys(file.images); // Get section keys dynamically
//     const [sectionIndex, setSectionIndex] = useState(0); // Track the current section index
//     const [currentData,setCurrentData]=useState(file.images[sections[0]][0]);//to render data 
//     const [index,setIndex]=useState(0);//to set cuurent index
//     const [msg,setMsg]=useState("");//to set msg
//     const [total,setTotal]=useState("");//to set total number of questions
//     const[totalQIS,setTotalQIS]=useState(file.images[sections[0]].length);//to set total number of question in section
//     const[current,setCurrent]=useState("");//to set the completed number of questions
//     // const[time,setTime]=useState("");//to set time taken to complete each question
//     const [img,setImg]=useState(false);//to set audio image
//     const[AudioOption,setAudioOption]=useState(null);//to handle the audio img
//     const [showPopup, setShowPopup] = useState(false);//to manage displaying popup
//     const [popupMessage, setPopupMessage] = useState("");//to set the popupmessage 
//     const [selectedOption,setSelectedOption]=useState("");//to store the selected option
//     const [color, setColor] = useState("red");//to set the msg color
//     const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);// to store the index of the selected option
//     // const [OptionBgColor,setOptionBgColor] = useState("white");//to set option background color
//     const [BgColor,setBgColor]=useState("");
//     const [showGif,setShowGif]=useState(false);
//     const [isSpeaking, setIsSpeaking] = useState(false);//to control the checkboxes and next button while audio is playing
//     // const[attempts,setAttempts]=useState(0);
//     // const [attempts, setAttempts] = useState(Array(file.images[sections[sectionIndex]].length).fill(0)); 
//     // const updateAttemptsInJson = (sectionKey, questionIndex, attempts) => {
//     //     file.images[sectionKey][questionIndex].attempts = attempts;
//     //     console.log(file.images[sectionKey][questionIndex].attempts);
//     // };
//     const HandleNext = () => {
//         const sectionKey = sections[sectionIndex];
//         // const currentQuestion = file.images[sectionKey][index];
//         if (selectedOption === currentData.correctanswer) {
           
//             // Check if the current question is the last one in the current section
//             if (index === file.images[sectionKey].length - 1) {
//                 // Check if it's the last section
//                 if (sectionIndex === sections.length - 1) {
//                     setCurrent("");
//                     setTotal("");
//                     // setPopupMessage("CONGRATULATIONS! YOU HAVE COMPLETED ALL SECTIONS");
//                     // setShowPopup(true);
//                     setColor("green");
//                     setShowGif(true);
//                     setMsg("CONGRATULATIONS! YOU HAVE COMPLETED ALL SECTIONS");
//                     // setNextButton("FINISH");
//                     setCurrentData(null);
                    
//                 } else {
//                     // Move to the next section
//                     const nextSectionIndex = sectionIndex + 1;
//                     setSectionIndex(nextSectionIndex);
//                     setCurrentData(file.images[sections[nextSectionIndex]][0]);
//                     setIndex(0);
//                     setPopupMessage(`CONGRATULATIONS! YOU HAVE COMPLETED SECTION-${sectionIndex + 1}`);
//                     setShowPopup(true);
//                     setTotalQIS(file.images[sections[nextSectionIndex]].length)
                   
//                     // setMsg(`CONGRATULATIONS! YOU HAVE COMPLETED SECTION-${sectionIndex + 1}`);
//                     // setNextButton("NEXT SECTION");
//                     // setCurrent("");
//                     // setTotal("");
                    
//                 }
//             } else {
//                 // Move to the next question in the current section
//                 // setAttempts(0);
//                 // currentQuestion.attempts=attempts[index]
//                 // console.log(attempts);
               
                
//                 const newIndex = index + 1;
//                 setIndex(newIndex);
//                 setCurrentData(file.images[sectionKey][newIndex]);
                
//             }
//         } else if (selectedOption === "") {
           
//             setMsg("Please select an option to move to the next question");
//         } else {
//             // setAttempts((prevAttempts) => {
//             //     const newAttempts = prevAttempts + 1;
//             //     currentQuestion.attempts = newAttempts;
//             //     return newAttempts;
//             // });
//             // const newAttempts = [...attempts];
//             // newAttempts[index]++;
//             // setAttempts(newAttempts);
//             // currentQuestion.attempts += 1;
//             // setAttempts(attempts+1);
//             // console.log(currentQuestion.attempts);
//             // const updatedAttempts = attempts + 1;
//             // setAttempts(updatedAttempts); // Increment attempts for wrong answer
//             setBgColor("red");
//             setMsg("Wrong answer! Please choose the correct answer that is related to the above picture");

//             // currentQuestion.attempts = updatedAttempts;
//             // updateAttemptsInJson(sectionKey, index, updatedAttempts);

//         }
        
//         setBgColor("");
//         setSelectedOption(""); 
//         setSelectedOptionIndex(null);
//     };
//     // useEffect(() => {
//     //     setAttempts(0); // Reset attempts when currentData changes
//     // }, [currentData]);

//     // useEffect(()=>{
//     //     const totalQ =()=>`Total number of questions: ${file.images['section-1'].length}`;
        
//     //     setTotal(totalQ());
//     // })
//     // useEffect(()=>{
//     //     const currentQ =()=>`Number of questions completed: ${index}`;
//     //     setCurrent(currentQ());
//     // })


//     //1)only when selected option matches with correct answer it should move to next
//     //2)if selected option does not matches with correct answer then display a message displaying wrong answer
//     // 3) if not selected any option display a message showing choose option
//     //dynamically jumbling of option
//     //option background
//     //audio control
//     //pop up for congratulations and performance




//     //to display total number of questions in each section 
//     // useEffect(() => {
//     //     if(!section1Done){
//     //         setTotal(`Total number of questions: ${file.images['section-1'].length}`);
//     //     }
//     //     else{
//     //         setTotal(`Total number of questions: ${file.images['section-2'].length}`);

//     //     }
//     //   });
//     useEffect(()=>{
//          setTotal(`Total number of questions: ${totalQIS}`)
//         setCurrent(`Number of questions completed: ${index}`)
//     },[index,totalQIS])
//     //to change data and number of questions completed each time 
//     //   useEffect(() => {
//     //     if (index < file.images['section-1'].length) {
//     //      if(!section1Done){
//     //         setCurrentData(file.images['section-1'][index]);
//     //      }
//     //      else{
//     //         setCurrentData(file.images['section-2'][index]);

//     //      }
//     //       setCurrent(`Number of questions completed: ${index}`);
//     //     }
//     //   }, [index,section1Done]);

//     //to set content in msg
//       const handleCheckboxChange=(option,key)=>{
//         setMsg("");
//         setSelectedOption(option);
//         setSelectedOptionIndex(key);

//       }
//       //to change text color
//     //   useEffect(() => {
//     //     if (msg === 'CONGRATULATIONS! YOU HAVE COMPLETED SECTION-1' || msg === 'CONGRATULATIONS! YOU HAVE COMPLETED SECTION-2' ) {
//     //         setColor("green");
//     //     } else {
//     //         setColor("red");
//     //     }
//     // }, [msg]);

//     const playAudio=(option)=>{
//         const utterance = new SpeechSynthesisUtterance(option);
//         utterance.onstart = () =>{ 
//             setIsSpeaking(true)
//             setImg(true)
//             setAudioOption(option)
//         };
//         utterance.onend = () =>{ 
//             setIsSpeaking(false)
//             setImg(false);
//             setAudioOption(null)
//         };
//         window.speechSynthesis.speak(utterance);
//     }
// //to play audio after finishing each section ,if user chooses wrong option, if next button is pressed without choosing anyoption
//     useEffect(() => {
//         if (msg.includes('CONGRATULATIONS') || msg.includes('Wrong answer') || msg.includes('Please select')) {
//             // Text-to-Speech
//             const utterance = new SpeechSynthesisUtterance(msg);
//             utterance.onstart = () => setIsSpeaking(true);
//             utterance.onend = () => setIsSpeaking(false);
//             window.speechSynthesis.speak(utterance);
//         }
//     }, [msg]);
   
   
    
//     const handlePopupClose=()=>{
//         setPopupMessage("");
//         setShowPopup(false);
//     }
//      console.log("normal",file.images[sections[sectionIndex]]);

//     useEffect(()=>{
//         if(showPopup){
//             console.log(file.images[sections[sectionIndex]])
//         }
//     })
//   return (
//     <div>
//     {/* <Navbar total={total} current={current} time={time}/> */}
//     <Header total={total} current={current} />
    
//     {showPopup && <PopUpCard1 message={popupMessage} attempts={file.images[sections[sectionIndex]]} close={handlePopupClose}/>}

    
//     <div style={{ textAlign: "center", backgroundColor: "#CBC3E3",border: '4px solid #660066', padding: "0.2%",margin:"3%", borderRadius: "2%",height:"25%",width:"94%" ,}}>
//     {
//         currentData && (
//             <div style={{ textAlign: "center" }}>
//                 <div style={{textAlign: "center",height: "25%", width: "50%", marginLeft: "24%",marginTop:"1%"}}>
//                     <img src={currentData.url} style={{height:"30%",width:"50%",padding:"1%"}} alt={currentData.caption}/>
//                     <p style={{fontWeight:"bold"}}>CHOOSE THE PASSAGE THAT MATCHES THE ABOVE PICTURE</p>
//                 </div>
            
//         <Option  currentData={currentData} handleCheckboxChange={handleCheckboxChange} BgColor={BgColor} img={img} AudioOption={AudioOption} playAudio={playAudio} isSpeaking={isSpeaking} selectedOptionIndex={selectedOptionIndex}  />
//             </div>
    
//         )
        
//     }
    
//     {msg && <div >
//     <p style={{color:color,fontWeight:"bold"}}>{msg}</p>
//     {showGif && <img style={{height:"80vh",width:"80vw"}} src={Congratulations} alt='gif'/>}
//     </div>}
//     <button onClick={HandleNext} style={{ margin: '0 auto', display: 'block' ,backgroundColor: '#660066',color: '#fff',border: 'none',padding: '10px 20px',borderRadius: 5,cursor: 'pointer',fontSize: 16,fontWeight: 'bold',marginTop: 20,}}>NEXT</button>
//     </div>
//     </div>
//   )
// }
// // setIndex((x)=>x+1);
// // style={showGif ? { backgroundImage: `url(${Congratulations})` } : null}
// //attempts
// //time
