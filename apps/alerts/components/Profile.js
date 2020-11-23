import React from 'react'
import { StatusBar, ImageBackground, Image, View } from 'react-native'
import { Container, Content, Text, ListItem, Left, Right, Body, Button} from 'native-base'

import Head from '../layout/Header'
import Ion from 'react-native-vector-icons/Ionicons'
import placeNature from '../assets/images/_nature-1.jpg'
import { styles } from '../assets/styles'
import { auth,firestore } from '../db'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import {UpdateForm} from './subs'

export default class Profile extends React.Component {
    constructor(){
        super()
        this.state = {
            index_number:"",
            phone:null,
            course:"",
            date_of_birth:"",
            update_tapped:false,
            additionalInfo:null
        }
    }

    componentDidMount(){
        firestore().collection('Users').where('user_id',"==", auth().currentUser.uid).get().then(qss => {
            let update
            qss.forEach(doc => {
                update = {...doc.data(), _id:doc.id}
            })

            this.setState({additionalInfo:update})
        })
    }

    render() {

            const adI = this.state.additionalInfo === null || this.state.additionalInfo === undefined ? {} : this.state.additionalInfo

        return (
            <Container>
                <StatusBar />
                <Head hideSearch={true} currentScreen="Profile" />
                <View style={{ flexDirection: 'row' }}>
                    <ImageBackground source={placeNature} style={{ width: "100%", height: 350, alignItems: 'center', justifyContent: "center" }}>
                        <Image source={{ uri: auth().currentUser.photoURL }} style={{ borderRadius: 360, width: 120, height: 120 }} />
        <Text style={{ ...styles.header, color: '#fff' }}> {"\n"} {auth().currentUser.displayName}</Text>
                        <Text note style={{ color: '#fff', ...styles.font }}>Joined: {new Date(auth().currentUser.metadata.creationTime).toLocaleDateString()}</Text>
                    </ImageBackground>
                </View>
                <Content style={styles.space}>
                    <Text style={styles.header}>{"\n"} Profile Details</Text>
                    <ListItem icon noBorder>
                        <Left>
                            <Icon name="user" size={24} />
                        </Left>
                        <Body>
                            <Text note style={{ ...styles.font }}>Name</Text>
                        </Body>
                        <Right>
                            <Text style={{ ...styles.font }}>{auth().currentUser.displayName}</Text>
                        </Right>
                    </ListItem>

                    <ListItem icon noBorder>
                        <Left>
                            <Icon name="calendar" size={24} />
                        </Left>
                        <Body>
                            <Text note style={{ ...styles.font }}>Gender</Text>
                        </Body>
                        <Right>
                            <Text style={{ ...styles.font }}>{adI.gender}</Text>
                        </Right>
                    </ListItem>

                    <ListItem icon noBorder>
                        <Left>
                            <Icon name="badge" size={24} />
                        </Left>
                        <Body>
                            <Text note style={{ ...styles.font }}>Index Number</Text>
                        </Body>
                        <Right>
                            <Text style={{ ...styles.font }}>{adI.index_number}</Text>
                        </Right>
                    </ListItem>

                    <ListItem icon noBorder>
                        <Left>
                            <Icon name="phone" size={24} />
                        </Left>
                        <Body>
                            <Text note style={{ ...styles.font }}>Phone</Text>
                        </Body>
                        <Right>
                            <Text style={{ ...styles.font }}>{adI.phone}</Text>
                        </Right>
                    </ListItem>

                    <ListItem icon noBorder>
                        <Left>
                            <Ion name="mail-outline" size={24} />
                        </Left>
                        <Body>
                            <Text note style={{ ...styles.font }}>Email</Text>
                        </Body>
                        <Right>
                            <Text style={{ ...styles.font }}>{auth().currentUser.email}</Text>
                        </Right>
                    </ListItem>


                    {adI.completed ? null :
                    <Button style={{marginTop:40}} success small onPress={(e) => this.setState({update_tapped:!this.state.update_tapped})}>
                        <Text style={{...styles.font}}>Update</Text>
                    </Button>
                    }
                    {this.state.update_tapped ? 
                        <UpdateForm/> : null
                    }
                </Content>
            </Container>
        )
    }
}