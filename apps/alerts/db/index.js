
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import { GoogleSignin, statusCodes } from '@react-native-community/google-signin'
import { LoginManager, AccessToken } from 'react-native-fbsdk';

GoogleSignin.configure({
        webClientId:'325918314646-sj63881isrg9jjdrcmhstov2h8ncq51o.apps.googleusercontent.com'
    })

const signInWithGoogle = async () => {
    
    try {
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();

        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);

        // Sign-in the user with the credential

        return auth().signInWithCredential(googleCredential);

    }catch(error){

        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            console.log('Sign In Cancelled')
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
            console.log("Progressing Here")
          
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            console.log('Play Services not Available')
            // play services not available or outdated
          } else {
            console.log(error)
          }
    }

}

const signInWithFacebook = async () =>  {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
  
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
  
    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();
  
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }
  
    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
  
    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

export { auth, firestore, storage, signInWithGoogle, signInWithFacebook }
