import React, { useContext, useEffect, useState } from 'react'
import './Chat.css'
import Left from '../../components/LeftChat/Left'
import ChatBox from '../../components/ChatBox/ChatBox'
import Right from '../../components/RightChat/Right'
import { Appcontext } from '../../context/Appcontext'

const Chat = () => {

  const { chatData, userData } = useContext(Appcontext)
  const [loading, setLoading] = useState(true)


  useEffect(()=>{
   if( chatData && userData ){
    setLoading(false)
   }
  },[chatData , userData])
  
  return (
    <div className='chat'>

      {loading ?
        <p className='loading'>Loading...</p>
        :
        <div className="chat-container">

          <Left />
          <ChatBox />
          <Right />

        </div>


      }
    </div>

  )
}

export default Chat
