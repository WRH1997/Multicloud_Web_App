
import { getFirestore, collection, addDoc, query, onSnapshot, orderBy } from 'firebase/firestore';
import firebaseClient from "./firebase";
import React, {useEffect, useState} from "react";
import {fetchCurrentMemberTeamData} from "./teamContext";

const db = getFirestore(firebaseClient);

const Chat = () => {
    const [state, setState] = useState({ message: '', name: '' });
    const [chat, setChat] = useState([]);
    const [isTeamPlayer, setIsTeamPlayer] = useState(false);
    const teamPlayerData = fetchCurrentMemberTeamData();
    if(teamPlayerData) {
        setIsTeamPlayer(true);
    }
    const onTextChange = (e) => {
        setState({ ...state, [e.target.name]: e.target.value });
    }

    const onMessageSubmit = async (e) => {
        e.preventDefault();
        const { name, message } = state;
        const teamCollectionName = teamPlayerData.teamName;
        if(message.length > 0) await addDoc(collection(db, teamCollectionName), { name, message });
        setState({ message: '', name });
    }

    const renderChat = () => {
        return chat.map(({ name, message }, idx) => (
            <div key={idx}>
                <h3>
                    {name}: <span>{message}</span>
                </h3>
            </div>
        ));
    }

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setChat(snapshot.docs.map(doc => doc.data()));
        });

        return () => unsubscribe();
    }, [db])

    return (
        <div>
            {!isTeamPlayer && (
                <div className="team-prompt">
                    <p><strong> Please join a team or create one to view Team Statistics, You can only join teams Upon
                        invitation</strong></p>
                </div>
            )}
            {isTeamPlayer && ( <div>
            <h1>Chat Log</h1>
            <form onSubmit={onMessageSubmit}>
                <h3>Name</h3>
                <input name="name" onChange={(e) => onTextChange(e)} value={state.name} label="Name" />
                <h3>Message</h3>
                <input name="message" onChange={(e) => onTextChange(e)} value={state.message} id="outlined-multiline-static" variant="outlined" label="Message" />
                <button>Send Message</button>
            </form>
            <div>
                {renderChat()}
            </div>
        </div> )}
        </div>
    )
}

export default Chat;