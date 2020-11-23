import React from 'react'
import { View, ImageBackground, StatusBar, StyleSheet } from 'react-native'
import { Button, Container, Text } from 'native-base'
import backImage from '../assets/images/_nature-1.jpg'
import { Overlay } from 'react-native-elements'
import { auth, signInWithGoogle, signInWithFacebook } from '../db'
import { GoogleSigninButton } from '@react-native-community/google-signin'
import Icon from 'react-native-vector-icons/Ionicons'

export default class Login extends React.Component {

    constructor() {
        super()
        this.state = {
            isSigninInProgress: false
        }
    }
    componentDidMount(){
        console.log(auth().currentUser)
    }
    //5c799df219594bf76ab7e5c955bb6e7d  -> app secret
    // 689292875330203 -> app id
    // MD5: 20:F4:61:48:B7:2D:8E:5E:5C:A2:3D:37:A4:F4:14:90
    // SHA1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
    // SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
    // Valid until: Tuesday, April 30, 2052


    render() {
        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                alignContent: 'center'
            },
            text: {
                fontSize: 40,
                marginTop:50,
                textAlign:'center',
                fontFamily: 'Sen-Regular'
            }
        })
        return (
            <Container>
                <StatusBar barStyle="light-content" />
                <ImageBackground source={backImage} style={{ width: "100%", height: "100%" }}>

                    <View style={styles.container}>
                        <Overlay isVisible={true}>
                            <>
                        <Text style={{...styles.text, color:'black'}}>Welcome, Dude</Text>

                            <View style={{ width: 500, height: 600, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                <View>
                                    <GoogleSigninButton
                                        style={{ width: 192, height: 48, }}
                                        size={GoogleSigninButton.Size.Wide}
                                        color={GoogleSigninButton.Color.Dark}
                                        onPress={(e) => signInWithGoogle().then(resp => console.log(resp.user)).catch(err => console.log(err))}
                                        disabled={this.state.isSigninInProgress} />
                                </View>
                                {/* 
                                <View>
                                    <Button primary iconLeft onPress={(e) => signInWithFacebook().then(resp => {
                                        alert("Success")
                                    }).catch(err => {
                                        console.log(err)
                                    })}
                                        style={{ marginTop: 15 }}>
                                        <Icon name='logo-facebook' size={24} color={"#fff"} style={{ paddingLeft: 15 }} />
                                        <Text note style={{ textTransform: 'capitalize', color: '#fff', fontFamily: 'Sen-Regular' }}>Sign in with Facebook</Text>
                                    </Button>
                                </View>
                                */}
                            </View>
                            </>
                        </Overlay>
                    </View>

                </ImageBackground>
            </Container>
        )

    }

}