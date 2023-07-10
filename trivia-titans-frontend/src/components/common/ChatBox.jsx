import {addDoc, collection, getFirestore, onSnapshot, orderBy, query} from 'firebase/firestore';
import firebaseClient from "./firebase";
import React, {useContext, useEffect, useState} from "react";
import {fetchMemberTeamData} from "./teamContext";
import {AuthContext} from "./AuthContext";

const db = getFirestore(firebaseClient);

const Chat = () => {
    const [message, setMessage] = useState('' );
    const [chat, setChat] = useState([]);
    const [isTeamPlayer,setIsTeamPlayer]=useState(false);
    const [name,setName]=useState('');
   // const navigate = useNavigate();

    const [teamName,setTeamName] =useState(null);
    const currentUser = useContext(AuthContext)
    useEffect(() => {
        const getTeamPlayerData = async () => {
            if (currentUser) {
                setName(currentUser.email);
                console.log(currentUser);
                const teamPlayerData = await fetchMemberTeamData(currentUser);
                console.log(teamPlayerData);
                if (teamPlayerData) {
                    setIsTeamPlayer(true);
                    console.log(isTeamPlayer);
                    setTeamName(teamPlayerData.teamName);
                }
                return teamPlayerData;
            }
        }
            getTeamPlayerData();

    }, [currentUser]);

    useEffect(() => {
        console.log(isTeamPlayer);
        if(isTeamPlayer) {
            const q = query(collection(db, teamName), orderBy('timestamp', 'desc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setChat(snapshot.docs.map(doc => doc.data()));
            });
            return () => unsubscribe();
        }
    }, [db,teamName])

    const onTextChange = (e) => {
        setMessage(e.target.value);
    }
    const onMessageSubmit = async (e) => {
        e.preventDefault();
        if(message.length > 0) await addDoc(collection(db, teamName), { name, message });
    }
    const renderChat = () => {
            return chat.map(({name, message}, idx) => (
                <div key={idx}>
                    <h4>
                        {name}: <span>{message}</span>
                    </h4>
                </div>
            ));
        }
    return (
        <div>
            {!isTeamPlayer && (
                <div className="team-prompt">
                    <p><strong> Please join a team or create one to chat with other team members, You can only join teams Upon
                        invitation</strong></p>
                </div>
            )}
            {isTeamPlayer && ( <div>
            <h1>Chat Log</h1>
            <form onSubmit={onMessageSubmit}>
                <h3>Message</h3>
                <input name="message" onChange={(e) => onTextChange(e)} value={message} id="outlined-multiline-static" variant="outlined" label="Message" />
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