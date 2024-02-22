import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { View, Text } from "react-native";
import { auth } from "../../../utils";
import { EmailAuthProvider, getAuth } from "firebase/auth";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { screen } from "../../../utils";

import { useState } from "react";
const GoogleLoginButton = () => {
  const navigation = useNavigation();
  const [userState, setUserState] = useState({ userInfo: null, error: null });
  const [disabled, setDisabled] = useState(false);

  async function iniciarSesionGoogle() {
    setDisabled(true);
    GoogleSignin.configure();
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserState({ userInfo, error: undefined });
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      const credential = new GoogleAuthProvider.credential(
        idToken,
        accessToken
      ); /*.credential(idToken, accessToken);*/
      await signInWithCredential(auth, credential);
      navigation.navigate(screen.account.account);
    } catch (error) {
      setDisabled(false);
      switch (error.code) {
        case statusCodes.SIGN_IN_CANCELLED:
          // user cancelled the login flow
          console.log("user cancelled the login flow");
          break;
        case statusCodes.IN_PROGRESS:
          // operation (eg. sign in) already in progress
          console.log("operation (eg. sign in) already in progress");
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          // play services not available or outdated
          console.log("play services not available or outdated");
          break;
        default:
          // some other error happened
          console.log(error);
      }
    }
  }

  return (
    <GoogleSigninButton
      onPress={iniciarSesionGoogle}
      style={{
        width: 225,
        height: 48,
        alignSelf: "center",
        margin: 0,
        padding: 0,
      }}
      disabled={disabled}
      size={GoogleSigninButton.Size.Wide}
    />
  );
};

export default GoogleLoginButton;
