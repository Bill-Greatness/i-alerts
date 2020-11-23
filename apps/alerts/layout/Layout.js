import React from 'react'
import 'react-native-gesture-handler'
import {StatusBar} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import Application from './Navigation'
import {auth} from '../db'
import {Login} from '../components'

export default class Layout extends React.Component{
    constructor(){
        super() 
        this.state={
           is_authenticated:false
        }
    }

    componentDidMount(){
        auth().onAuthStateChanged((user) => {
            if(user){
                this.setState({is_authenticated:true})
            }else{
                this.setState({is_authenticated:false})
            }
        })
    }
    render(){
        return(
            <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            {this.state.is_authenticated ? 
            <Application /> : <Login />}

            </NavigationContainer>
        )
    }
}