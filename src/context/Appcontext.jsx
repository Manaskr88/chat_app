import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export const Appcontext = createContext();

const AppcontextProvider = (props) =>{

    const [userData , setUserData] = useState(null)
    const [chatData , setChatData] = useState(null)

    const [messageId , setMessageId] = useState(null)
    const [messages , setMessages ] = useState([])
    const [chatUser , setChatUser] = useState(null)
  

    const [visible , setVisible] = useState(false)

    const navigate = useNavigate()

    const loadUserData = async (uid)=>{
        try {
             const userRef = doc(db, 'users' , uid);   
             const userSnap = await getDoc(userRef);
             
             const userData = userSnap.data()

             setUserData(userData);

             if(userData.avatar && userData.name){ // agr pic and name  h user ka  toh chat pe rehne do
                navigate('/chat')

             }
             else{
                navigate('/profile')   // agr nahi h toh navigate krdo profile page pe for updating
             }

             // if user is online , it will be updates every minute

             await updateDoc(userRef , {
                lastSeen: Date.now()
             })

             setInterval(async() => {

                if(auth.chatUser){
                    await updateDoc(userRef , {  // updateDoc is used for updating
                        lastSeen: Date.now()
                     })

                }
                
             }, 60000);  // har 1 min pe refresh hoga 
            
        } 
        catch (error) {
            
        }
    }


    useEffect(()=>{
        if(userData){

            const chatRef = doc(db , 'chats' , userData.id )

            const unSub = onSnapshot(chatRef , async (res)=>{
                const chatItems = res.data().chatsData
                
                
                const tempData = [];  // it will store chat data
                
                // we will get the data of chats from a user whose chat is this when the fo rloop will complete
                for(const item of chatItems ){
                    const userRef = doc(db, `users/${item.rId}`)  // rId = receiver Id
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();

                    tempData.push({...item , userData})
                }

                setChatData(tempData.sort((a,b)=>b.updaetedAt - a.updaetedAt))  // for keeping new chats on above
            })
            return()=>{
                unSub()    // calling func
            }
        }

    },[userData])

    const value ={  // we can pass in this and use in diff file
        userData , setUserData , chatData , setChatData , loadUserData,
        messages , setMessages , chatUser , setChatUser ,messageId , setMessageId , visible , setVisible
    }  


    return (
        <Appcontext.Provider value={value}>

            {props.children}

        </Appcontext.Provider>
    )
}

export default AppcontextProvider