import React, { useContext, useEffect, useState } from 'react'
import './ProfileUpdate.css'
import assets from '../../assets/assets'
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
// import { getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/Upload';
import { Appcontext } from '../../context/Appcontext';

const ProfileUpdate = () => {

  const { setUserData } = useContext(Appcontext)

  const [image, setImage] = useState(false);

  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [uid, setUid] = useState('')
  const [prevImage, setPrevImage] = useState('')

  const navigate = useNavigate('')


  const ProfileUpdatee = async (e) => {
    e.preventDefault()

    try {

      if (!prevImage && !image) {

        toast.error("Upload a picture")
      }

      // this will update name , bio , image in firebase 

      const docRef = doc(db, 'users', uid);
      if (image) {

        const imgUrl = await upload(image)
        setPrevImage(imgUrl);
     
        await updateDoc(docRef, {   // updating here
          avatar: imgUrl,
          bio: bio,
          name: name
        })

      }

      // if image not there still it can update 
      
      else {

        await updateDoc(docRef, {
          // avatar: imgUrl,
          bio: bio,
          name: name
        })
      }

      const snap = await getDoc(docRef)
      setUserData(snap.data())
      navigate('/chat')


    }


    catch (error) {
      console.error(error);
      toast.error(error.message)
      

    }


  }

  useEffect(() => {

    onAuthStateChanged(auth, async (user) => {


      if (user) {
        setUid(user.uid);


        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);


        if (docSnap.data().name) {
          setName(docSnap.data().name);
        }

        if (docSnap.data().bio) {
          setBio(docSnap.data().bio);
        }

        if (docSnap.data().avatar) {
          setPrevImage(docSnap.data().avatar);
        }

      }

      else {
        navigate('/')

      }
    })






  }, [])

  return (

    <div className='profile'>

      <div className="profile-container">
        <form onSubmit={ProfileUpdatee}>
          <h2>Profile Details</h2>

          <label htmlFor='avatar'>

            <input onChange={(e) => setImage(e.target.files[0])} type="file" id='avatar' accept='.png , .jpg , .jpeg' hidden />

            <img src={image ? URL.createObjectURL(image) : prevImage? prevImage  : assets.avatar_icon} alt="" /> upload profile image

          </label>

          <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder='Your name' required />

          <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder='Write Bio' required></textarea>

          <button type='submit'>Save</button>

        </form>

        <img src={image ? URL.createObjectURL(image) : prevImage? prevImage: assets.myy} alt="" />

      </div>

    </div>
  )
}

export default ProfileUpdate
