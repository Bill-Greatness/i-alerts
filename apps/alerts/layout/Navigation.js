import React from 'react'
import { Home, Profile, Create, Notification} from '../components'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs' 
import AntIcon from 'react-native-vector-icons/AntDesign'
import Ion from 'react-native-vector-icons/Ionicons'
import Sim from 'react-native-vector-icons/SimpleLineIcons'
import {styles, colors} from '../assets/styles'
import {firestore} from '../db'

export default class Application extends React.Component {
    constructor() {
        super()
        this.state = {
            rN:[]
        }
    }

    componentDidMount() {
        firestore().collection('Notification').onSnapshot(qss => {
            // for now lets show all.
            let notes = []
            qss.forEach(doc => {
                    notes.push({...doc.data(), _id:doc.id})
            })

            this.setState({rN:notes},() => notes = [])
        })
    }
    render() {
        const Tab = createBottomTabNavigator()
        return (
            <Tab.Navigator 
               
                initialRouteName="Home"
                tabBarOptions={{
                    activeTintColor: '#cc2abb',
                    labelPosition: 'below-icon', 
                    style:styles.tabBar,
                    labelStyle:styles.tabFont,
                    keyboardHidesTabBar:true,
                    tabBarBadgeStyle:styles.badge  
                }}>
                <Tab.Screen
                    name="Home"
                    component={Home}
                    
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <Ion name="ios-home-outline" color={colors.light} size={size} />
                        ),

                    }} />


                <Tab.Screen
                    name="Create"
                    component={Create}
                    options={{
                        tabBarLabel: 'Create',
                        tabBarIcon: ({ color, size }) => (
                            <AntIcon name="edit" color={colors.light} size={size} />
                        ),
                    }} />


                <Tab.Screen
                    name="Notification"
                    component={Notification}
                    options={{
                        tabBarLabel: 'Notes',
                        tabBarBadge: this.state.rN.length < 1 ? null : this.state.rN.length,    
                        tabBarIcon: ({ color, size }) => (
                            <Sim name="bell" color={colors.light} size={size} />
                        ),
                    }} />

                <Tab.Screen
                    name="Profile"
                    component={Profile}
                    options={{
                        tabBarLabel: 'Profile',

                        tabBarIcon: ({ color, size }) => (
                            <Sim name="user" color={colors.light} size={size} />
                        ),
                    }} />



            </Tab.Navigator>
        )
    }
}