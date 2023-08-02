import {addDoc, collection, getFirestore, onSnapshot, orderBy, query,serverTimestamp} from 'firebase/firestore';
import {firebaseClient} from "./firebase";
import React, {useContext, useEffect, useRef, useState} from "react";
import {fetchMemberTeamData} from "./teamContext";
import {AuthContext} from "./AuthContext";
import { Button, TextField, List, ListItem, ListItemText, Typography, Container, Paper } from "@mui/material";

const db = getFirestore(firebaseClient);

const Chat = () => {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const [isTeamPlayer,setIsTeamPlayer]=useState(false);
    const [name,setName]=useState('');
    const [teamName,setTeamName] =useState(null);
    const currentUser = useContext(AuthContext)

    const scrollRef = useRef(null);
    
    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.lastElementChild.scrollIntoView({ behavior: "smooth" });
        }
      }, [message, chat]);

    useEffect(() => {
        const getTeamPlayerData = async () => {
            if (currentUser) {
                setName(currentUser.email);
                const teamPlayerData = await fetchMemberTeamData(currentUser.email.toString());
                console.log(teamPlayerData);
                if (teamPlayerData) {
                    setIsTeamPlayer(true);
                    setTeamName(teamPlayerData.teamName);
                }
            }
        }
        getTeamPlayerData();
    }, [currentUser]);

    useEffect(() => {
        if(isTeamPlayer && teamName) {
            const q = query(collection(db, teamName), orderBy('timestamp', 'asc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setChat(snapshot.docs.map(doc => doc.data()));
            });
            return () => unsubscribe();
        }
    }, [db,teamName, isTeamPlayer])

    const onTextChange = (e) => {
        setMessage(e.target.value);
    }

    const onMessageSubmit = async (e) => {
        e.preventDefault();
        if(message.length > 0) {
            await addDoc(collection(db, teamName), { name, message , timestamp: serverTimestamp() });
            setMessage('');
        }
    }

    const renderChat = () => {
        return chat.map(({name, message,timestamp}, idx) => (
            <ListItem key={idx}>
                <ListItemText primary={name} secondary={message}/>
                 <ListItemText>
                     <span style={{ fontSize: "0.60rem" }}>{timestamp ? timestamp.toDate().toString():'...'}</span>
                 </ListItemText>
            </ListItem>
        ));
    }

    return (
        <Container maxWidth="sm">
            {!isTeamPlayer && (
                <Typography variant="h6" color="error">
                    Please join a team or create one to chat with other team members. You can only join teams upon invitation.
                </Typography>
            )}
            {isTeamPlayer && (
                <Paper style={{ maxHeight: '70vh', overflow: 'auto' }}>
                    <List ref={scrollRef}>{renderChat()}</List>
                    <form onSubmit={onMessageSubmit} style={{ position: 'sticky', bottom: 0, padding: '10px', background: 'white', borderTop: '1px solid #ddd' }}>
                        <TextField
                            name="message"
                            onChange={onTextChange}
                            value={message}
                            id="outlined-multiline-static"
                            variant="outlined"
                            label="Message"
                            fullWidth
                        />
                        <Button variant="contained" color="primary" type="submit" style={{ marginTop: '10px' }}>
                            Send Message
                        </Button>
                    </form>
                </Paper>
            )}
        </Container>
    )
}
export default Chat;