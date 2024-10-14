import React, { useContext, useEffect, useState } from 'react'
import './ChatBox.css'
import assets from '../../assets/assets'
import { Appcontext } from '../../context/Appcontext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firebase'
import upload from '../../lib/Upload';
import { toast } from 'react-toastify'

const ChatBox = () => {

    const { messageId, visible , setVisible,  userData, chatUser, messages, setMessages } = useContext(Appcontext)
    const [input, setInput] = useState('')  // chat user will stored 
   const navigate = useNavigate()

    const sendMessage = async () => {
        try {

            if (input && messageId) {
                await updateDoc(doc(db, 'messages', messageId), {
                    messages: arrayUnion({
                        sId: userData.id,  // sender id
                        text: input,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef)

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();

                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messageId)
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);



                        userChatData.chatsData[chatIndex].updatedAt = Date.now();

                        if (userChatData.chatsData[chatIndex].rId === userData.id) {

                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })

                    }
                })

            }
        } catch (error) {
            toast.error(error.message)
        }

        setInput("")
    }

    const sendImage = async (e) => {

        try {

            const fileUrl = await upload(e.target.files[0])

            if (fileUrl && messageId) {
                await updateDoc(doc(db, 'messages', messageId), {
                    messages: arrayUnion({
                        sId: userData.id,  // sender id
                        image: fileUrl,
                        createdAt: new Date()
                    })
                })

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatsSnapshot = await getDoc(userChatsRef)

                    if (userChatsSnapshot.exists()) {
                        const userChatData = userChatsSnapshot.data();

                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageId === messageId)
                        userChatData.chatsData[chatIndex].lastMessage = "Image";



                        userChatData.chatsData[chatIndex].updatedAt = Date.now();

                        if (userChatData.chatsData[chatIndex].rId === userData.id) {

                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        })

                    }
                })
            }

        } catch (error) {
            toast.error(error.message)
        }


    }

    const convertTime = (timestamp) => {
        let date = timestamp.toDate();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        if (hour > 12) {
            return hour - 12 + ":" + minutes + "PM";
        }
        else {
            return hour + ":" + minutes + "AM";
        }
    }

    useEffect(() => {
        if (messageId) {
            const unSub = onSnapshot(doc(db, 'messages', messageId), (res) => {
                setMessages(res.data().messages.reverse())  // for newer message storage

            })

            return () => {
                unSub();
            }
        }
    }, [messageId])

    return chatUser ? (

        <div className={`chatbox ${visible? "" : "hidden" }` }>

            <div className="user">

                <img src={chatUser.userData.avatar} />

                <p> {chatUser.userData.name} {Date.now()-chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} /> : "" }</p>

                
                <img src={assets.help_icon} className='help' />
                <img onClick={()=>setVisible(false)} src={assets.arrow_icon} className='arrow' />

            </div>


            <div className="chat-msg">

                {/* sender msg  */}

                {messages.map((msg, index) => (

                    <div key={index} className={msg.sId === userData.id ? "s-msg" : "r-msg"}>

                        {msg["image"] ?
                            <img className='msg-img' src={msg.image} />
                            :
                            <p className='msg s'>{msg.text}</p>

                        }

                        <div className="">
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} />
                            <p>{convertTime(msg.createdAt)}</p>
                        </div>



                    </div>
                ))}




            </div>


            {/* msg  */}


            <div className="input">

                <input onChange={(e) => setInput(e.target.value)} value={input} type='text' placeholder='Send a message' />
                <input onChange={sendImage} type='file' id='image' accept='image/png , image/jpeg' hidden />

                <label htmlFor='image' >
                    <img src={assets.gallery_icon} />
                </label>


                <label htmlFor='imagee' >
                    <img onClick={sendMessage} src={assets.send_button} />
                </label>
            </div>

        </div >
    )
        :
        <div className={`chat-welcome ${visible? "" : "hidden" }` }>
            <img src={assets.myy} />
            <p>Chat with your love-beings</p>
        </div>
}

export default ChatBox
