import React from 'react'
import { StatusBar, ScrollView, Modal, View, TouchableOpacity } from 'react-native'
import { Container, ListItem, Left, Right, Body, Text, Card, Thumbnail, CardItem } from 'native-base'
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Ion from 'react-native-vector-icons/Ionicons'
import { auth, firestore } from '../db'
import Head from '../layout/Header'
import { AddNotes } from './subs'
import { styles } from '../assets/styles'

export default class Notification extends React.Component {
    constructor() {
        super()
        this.state = {
            visible: false,
            show_pad: false,
            rN: [],
            cNote: {}
        }
    }

    componentDidMount() {
        firestore().collection('Notification').onSnapshot(qss => {
            let _notes = []
            qss.forEach(doc => {
                _notes.push({ ...doc.data(), _id: doc.id })
            })

            this.setState({ rN: _notes }, () => _notes = [])

        })
    }

    notesModal = () => {
        const note = this.state.cNote
        return (
            <Modal transparent animationType="slide" visible={this.state.visible}>
                <View style={{ width: '70%', marginTop: 20, alignSelf: 'center', justifyContent: 'center' }}>
                    <Card>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{ uri: note.author_image }} small />
                                <Body>
                                    <Text style={{ ...styles.font, fontSize: 20 }}>{note.sender_name}</Text>
                                    <Text note style={{ ...styles.font }}>Sent On:{note.date_sent} @ {note.time_sent}</Text>
                                </Body>
                            </Left>

                            <Right>
                                <TouchableOpacity style={{ padding: 10 }} onPress={(e) => this.setState({ visible: false })}>
                                    <Ion name="close-circle" color={'red'} size={30} />
                                </TouchableOpacity>
                            </Right>
                        </CardItem>
                        <CardItem>
                            <Text note style={{ ...styles.font, fontSize: 16, paddingLeft: 10, paddingRight: 10 }}>
                                {note.content}
                            </Text>
                        </CardItem>
                    </Card>
                </View>
            </Modal>
        )
    }

    deleteNote = note_id => {
        firestore().collection('Notification').doc(note_id).delete().then(resp => {

        }).catch(err => {

        })
    }
    render() {
        return (
            <Container>
                {this.notesModal()}
                <StatusBar barStyle="light-content" />
                <Head hideSearch currentScreen="notifications" showNote={true} openNotePad={() => this.setState({ show_pad: true })} />
                <View style={{ flex: 1, padding: 20 }}>
                    <ScrollView style={styles.space}>
                        {this.state.rN.map(nt => (
                            <ListItem icon noBorder key={nt.notification_id} style={{ marginBottom: 20 }}>
                                <Left>
                                    <Icon name="bell" size={24} />
                                </Left>
                                <Body>
                                    <Text style={{ ...styles.font }}>{nt.heading} - {nt.target}</Text>
                                    <Text note style={{ ...styles.font }}>{nt.content.slice(0, 50)} ...</Text>
                                </Body>
                                <Right>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View>
                                            <TouchableOpacity onPress={(e) => this.setState({ visible: !this.state.visible, cNote: nt })}>
                                                <Ion name="information-circle" size={24} color={'green'}/>
                                            </TouchableOpacity>
                                        </View>

                                        {nt.sender === auth().currentUser.email ? 
                                        <View style={{paddingLeft:15}}>
                                            <TouchableOpacity onPress={(e) => this.deleteNote(nt._id)}>
                                                <Ion name="trash-bin" size={24} color={'red'}/>
                                            </TouchableOpacity>
                                        </View> : null }

                                    </View>
                                </Right>
                            </ListItem>
                        ))}

                    </ScrollView>
                    <AddNotes show_pad={this.state.show_pad} closePad={() => this.setState({ show_pad: false })} />

                </View>
            </Container>
        )
    }
}