import React, { useContext, useEffect, useState } from 'react'
import './Left.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { db, logout } from '../../config/firebase'
import {  toast } from 'react-toastify'
import { arrayUnion, collection, getDoc , doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import { Appcontext } from '../../context/Appcontext'
// import { getDoc } from 'firebase/firestore'
// import { doc } from 'firebase/firestore'

const Left = () => {

    const navigate = useNavigate()

    const { userData, visible , setVisible , chatData , chatUser , setChatUser , setMessageId , messageId} = useContext(Appcontext);

    const [user, setUser] = useState(null)
    const [showSearch, setShowSearch] = useState(false)

    const inputHandler = async (e) => {  // for searching users
        try {
            const input = e.target.value;

            if (input) {
                setShowSearch(true)
                const userRef = collection(db, 'users');

                const q = query(userRef, where("username", "==", input.toLowerCase()));
                const querySnap = await getDocs(q)
                if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {  // khud ka naam na aae search krne pe
                    // console.log(querySnap.docs[0].data());
                    let userExist = false;
                    chatData.map((user) => {
                        if (user.rId === querySnap.docs[0].data().id) {
                            userExist = true;
                        }
                        
                    })
                    // console.log(chatData);
                    
                    if(!userExist){

                        setUser(querySnap.docs[0].data());
                    }
                    

                }
                else {
                    setUser(null)
                }


            }

            else {
                setShowSearch(false)
            }

        }

        catch (error) {

        }
    }

    const addCHat = async () => {  // for adding chats and message into database

        const messagesRef = collection(db, "messages");
        const chatsRef = collection(db, "chats");

        try {
            const newMessageRef = doc(messagesRef)
            await setDoc(newMessageRef, {
                createAt: serverTimestamp(),
                messages: []
            })

            await updateDoc(doc(chatsRef, user.id), { // when we will establish any connection btwn 2 user , we will create this data in both data 
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,    // first User
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })

            await updateDoc(doc(chatsRef, userData.id), { // when we will establish any connection btwn 2 user , we will create this data in both data 
                chatsData: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: user.id,   // second user
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })
        
            const uSnap = await getDoc(doc (db , 'users', user.id))

            const uData = uSnap.data();
            setChat({
                messageId : newMessageRef.id,
                lastMessage: "",
                rId : user.id,
                updatedAt:Date.now(),
                messageSeen: true,
                userData: uData
            })

            setShowSearch(false)
            setVisible(true);


        } catch (error) {
            toast.error(error.message)
        }


    }

    const setChat = async(item)=>{
    //    console.log(item);

    try {
        
      setMessageId(item.messageId)
      setChatUser(item)

      const userChatsRef  = doc(db, 'chats' , userData.id);

      const userChatsSnapshot = await getDoc(userChatsRef);

      const userChatsData = userChatsSnapshot.data();
      const chatIndex = userChatsData.chatsData.findIndex((c)=>c.messageId === item.messageId);

      userChatsData.chatsData[chatIndex].messageSeen = true;

      await updateDoc(userChatsRef , {
        chatsData: userChatsData.chatsData
      })

      setVisible(true);   // for side bar

    } 
    catch (error) {
          toast.error(error.message)
    }
      
    

    useEffect(()=>{
          const updateChatUser = async()=>{
              
            if(chatUser){

                const userRef = doc(db , "users" , chatUser.userData.id)

                const userSnap = await getDoc(userRef)

                const userData = userSnap.data()
                setChatUser(prev=>({...prev , userData:userData}))
            }
            
          }

          updateChatUser()
    },[chatData])
       

    }
    return (
        <div className={`left ${visible? "hidden" : "" }`}>

            <div className="top">

                <div className="nav">

                    <img src={assets.myy} className='logo' />

                    <div className="menu">
                        <img src={assets.menu_icon} className='' />

                        <div className="sub-menu">
                            <p onClick={() => navigate('/profile')}>Edit Profile</p>
                            <hr />
                            <p onClick={logout}>Logout</p>

                        </div>
                    </div>

                </div>

                <div className="search">
                    <img src={assets.search_icon} />
                    <input onChange={inputHandler} type='text' placeholder='search here' />
                </div>

            </div>

            <div className="list">

                {showSearch && user ?

                    <div onClick={addCHat} className="friends add-user">
                        <img src={user.avatar} />
                        <p>{user.name}</p>
                    </div>
                    :
                     chatData && chatData.map((item, index) => (
                        
                        <div onClick={()=>{setChat(item)}} key={index} className={`friends ${item.messageSeen || item.messageId === messageId? "" : "border" }`}>
                            <img src={item.userData.avatar} />

                            <div className="">
                                <p>{item.userData.name}</p>
                                <span>{item.lastMessage}</span>
                            </div>

                        </div>
                        
                    ))
                    
                }
                






            </div>


        </div>
    )
}

export default Left
