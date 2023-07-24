import { useNavigate } from "react-router";
import React from 'react';
import Popup from 'reactjs-popup';
import '../../themes/Chatbot.css';


export default function Chatbot(){
    return(
        <div className='bot-div'>
            <Popup trigger={<button> Nav Bot</button>} position="left" keepTooltipInside=".bot-div">
                <iframe className='bot-if' src="https://d15tyd0pgcrf8x.cloudfront.net/index.html"></iframe>
            </Popup>
        </div>
    )
}
