import React from 'react'

import { Overlay } from 'react-native-elements'
import { Input, Card, CardItem, Thumbnail, Left, Body, Text, Button } from 'native-base'
import { View, ScrollView, TouchableOpacity} from 'react-native'

import {styles} from '../../assets/styles'
import Icon from 'react-native-vector-icons/Ionicons'
import {firestore, auth} from '../../db'


export default function Comments({ post_id, visible, closeVisible }) {

        const [commentsList, setCommentsList] = React.useState([])
        const [comment, setComment] = React.useState("")

        React.useEffect(() => {
            firestore().collection('Comments').where('post_id','==',post_id).onSnapshot(qss => {
                let _comments = []
                qss.forEach(doc => {
                    _comments.push({...doc.data(),_id:doc.id})
                })
                setCommentsList(_comments), _comments = []
            })
        },[post_id])

        const postComment = () => {
            firestore().collection('Comments').add({
                comment:comment.trim(),
                post_id:post_id, 
                time_posted: new Date().toLocaleTimeString(),
                date_posted: new Date().toLocaleDateString(),
                author_name: auth().currentUser.displayName,
                author_image: auth().currentUser.photoURL,
                author_id: auth().currentUser.uid
            }).then(resp => {
                setComment('')
            }).catch(err => {

            })
        }
    return (
        <Overlay isVisible={visible}>
            <View style={{ minWidth: '60%', maxWidth: '65%', minHeight: '70%' }}>
            <TouchableOpacity style={{position:'absolute', bottom:60, right:0, zIndex:-1000}} onPress={() => closeVisible()}>
            <Icon name='close-circle-outline' size={24} style={{padding:10}} color={'red'}/>
          </TouchableOpacity>
                <ScrollView style={{ maxHeight: '70%' }}>
                    {commentsList.map(idx => (
                        <View key={idx._id} style={{marginTop: 10, marginBottom:5 }}>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <Thumbnail source={{uri: idx.author_image}} small/>
                                        <Body>
                                            <Text style={{...styles.font}}>{idx.author_name}</Text>
                                            <Text note style={{...styles.font, fontSize:15}}>
                                                {idx.comment}
                                             </Text>
                                        </Body>
                                    </Left>
                                    
                                </CardItem>
                            </Card>

                        </View>
                    ))}

                </ScrollView>
                <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, }}>
                    <Input multiline value={comment} placeholder={"Comments Here"} onChangeText={text => setComment(text)}/> 
                    <Button success small disabled={!comment} onPress={(e) => postComment()}>
                        <Text style={{...styles.font}}>Send</Text>
                    </Button>
                </View>
            </View>
        </Overlay>
    )
}