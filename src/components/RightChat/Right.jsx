import React, { useContext, useEffect, useState } from 'react'
import './Right.css'
import assets from '../../assets/assets'
import { logout } from '../../config/firebase'
import { Appcontext } from '../../context/Appcontext'
const Right = () => {


  const { chatUser, messages } = useContext(Appcontext)
  const [msgImages, setMsgImages] = useState([])

  useEffect(() => {
    let temp = [];
    messages.map((msg) => {

      if (msg.image) {
        temp.push(msg.image)
      }

    })

    setMsgImages(temp)


  }, [messages])



  return chatUser ?
    (
      <div className='right'>

        <div className="profile-media">

          <img src={chatUser.userData.avatar} />
          <h3>     {chatUser.userData.name}   {Date.now()-chatUser.userData.lastSeen <= 70000 ? <img className='dot' src={assets.green_dot} /> : "" } </h3>

          <p>{chatUser.userData.bio}.</p>

        </div>

        <hr />

        <div className="media">
          <p>Media</p>

          <div className="images">

            {msgImages.map((url, index) => (


              <img onClick={()=>window.open(url)} src={url} key={index} alt="" />
            ))}


          </div>

        </div>

        <button onClick={() => logout()}>Logout</button>


      </div>
    )

    :
    (
      <div className="right">
        <button onClick={() => logout()}>Logout</button>
      </div>
    )
}

export default Right
