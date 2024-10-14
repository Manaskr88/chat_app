import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";

import { toast } from "react-toastify";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Lvlad-_3STkStfzylx3WWHGMdxBGnCg",
  authDomain: "chat-me-eea68.firebaseapp.com",
  projectId: "chat-me-eea68",
  storageBucket: "chat-me-eea68.appspot.com",
  messagingSenderId: "632744875894",
  appId: "1:632744875894:web:559be6a2eb20af06c14c57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app)



const signUp = async(username , email , password)=>{

    try{
        const res = await createUserWithEmailAndPassword(auth , email , password)
        const user = res.user;  // storing auth , email , pass in user

        await setDoc(doc(db , "users" , user.uid ),{    // setDoc is used to crate two different document like users and chat 

            id: user.uid,    
            username : username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"hii , i am using chat app",
            lastSeen : Date.now()

        })

        await setDoc(doc(db , "chats" , user.uid),{
            chatsData : []

        })

        
    }
    catch (error) {
        console.error(error)
        toast.error(error.code.split('/' )[1].split('-').join(" "))
        
        
    }
    
    
}
// console.log(signUp);

const login = async(email , password) =>{
    try {

         await signInWithEmailAndPassword(auth , email , password);
        
    } 
    
    catch (error) {

        console.error(error)
        toast.error(error.code.split('/' )[1].split('-').join(" "))
        
    }
}

const logout  = async() =>{
    try {
        
        await signOut(auth )

    } catch (error) {

        toast.error(error.code.split('/' )[1].split('-').join(" "))
        
    }
}


const resetPassword = async(email)=>{

    if(!email){
        toast.error("Enter Your email");
        return null;
    }

    try {
        const userRef = collection(db , 'users' );
        const q = query(userRef , where("email" , "==" , email))
        const querySnap = await getDocs(q);
        
        if(!querySnap.empty){
            await sendPasswordResetEmail(auth , email);
            toast.success("Reset Email Sent")

        }
        else{
            toast.error("Email doesn't exist")
        }

    }
     catch (error) {
          console.log(error);
          toast.error(error.message)
          
        
    }

}

export {signUp , login , logout , auth , db ,resetPassword }