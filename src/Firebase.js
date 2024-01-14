// AUTHENTICATION IMPORTS
import { initializeApp } from "firebase/app";
import {
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    setPersistence,
    browserLocalPersistence,
} from "firebase/auth";
import { OAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router"; 


// FIREBASE CONFIG
const firebaseConfig = {
    
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new OAuthProvider('microsoft.com');
provider.setCustomParameters({
    tenant: "wpi.edu"
});

// AUTHENTICATION WITH EMAIL AND PASSWORD
const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password).then((res) => {
            console.log(res); 
        });
    } catch {
        return "Invalid password or email";
    }
};

// AUTHENTICATION WITH EMAIL AND PASSWORD
const registerWithEmailAndPassword = async (email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

function loginWithMicrosoft() {
    
    setPersistence(auth, browserLocalPersistence).then(() => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // User is signed in.
                // IdP data available in result.additionalUserInfo.profile.

                // Get the OAuth access token and ID Token
                const credential = OAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const idToken = credential.idToken;
                
               
            })
            .catch((error) => {
                // Handle error.
            });

        

    })
    
   


};

// LOGOUT
const logout = () => {
    signOut(auth);
};

// EXPORTS
export {
    auth,
    app,
    logInWithEmailAndPassword,
    loginWithMicrosoft,
    registerWithEmailAndPassword,
    logout,
};
