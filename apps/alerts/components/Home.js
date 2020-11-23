import React from 'react'
import { View, ScrollView, TouchableOpacity, Image } from 'react-native'
import _ from 'lodash'
import {
    Container, Text, Card, CardItem,
    Left, Body, Right, Thumbnail, Content
} from 'native-base'
import { styles } from '../assets/styles/'
import Ant from 'react-native-vector-icons/AntDesign'
import Ion from 'react-native-vector-icons/Ionicons'
import { Comments } from './subs'
import Head from '../layout/Header'
import { auth, firestore } from '../db'

export default class Home extends React.Component {
    _isMounted = false
    constructor() {
        super()
        this.state = {
            activateSearch: false,
            visible: false,
            posts: [],
            post_id: '',
            reactions: [],
            comments: []
        }
    }
    componentDidMount() {
        this._isMounted = true
        firestore().collection('Content').onSnapshot(qss => {
            let content = []
            qss.forEach(doc => {
                content.push({ ...doc.data(), _id: doc.id })
            })

            if (this._isMounted) {
                this.setState({ posts: content }, () => content = [])
            }

        })

        firestore().collection('Comments').onSnapshot(qss => {
            let _comments = []
            qss.forEach(doc => {
                _comments.push({ ...doc.data(), _id: doc.id })
            })
            this.setState({ comments: _comments }, () => _comments = [])

        })


        firestore().collection('Reaction').onSnapshot(qss => {
            let _reaction = []
            qss.forEach(doc => {
                _reaction.push({ ...doc.data(), _id: doc.id })
            })

            if (this._isMounted) {
                this.setState({ reactions: _reaction }, () => _reaction = [])
            }

        })
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
     }

    deletePost = _id => {
        firestore().collection('Content').doc(_id).delete().then(resp => {
            this.showToast('Post Deleted ! 😋')
        }).catch(err => {
        })
    }

    hasReacted = (user_id, post_id) => {
        const all_reactions = _.filter(this.state.reactions, (rcn) => { return rcn.post_id === post_id })
        const status = _.find(all_reactions, (sts) => { return sts.act_id === user_id })

        if (status === undefined) {
            return false
        } else {
            return true
        }
    }

    getTotalReaction = (post_id) => {
        return _.filter(this.state.reactions, (rcn) => { return rcn.post_id === post_id }).length
    }

    getTotalComment = (post_id) => {
        return _.filter(this.state.comments, (rcn) => { return rcn.post_id === post_id }).length
    }

    toggleReaction = (user_id, post_id, doc_id) => {

        const hasReacted = this.hasReacted(user_id, post_id)
        if (hasReacted) {
            const reactedPost = _.find(this.state.reactions, (rP) => {
                return rP.post_id === post_id && rP.act_id === user_id && rP.doc_id === doc_id
            })

            if (reactedPost !== undefined) {
                firestore().collection('Reaction').doc(reactedPost._id).delete().then(resp => {

                }).catch(err => {

                })
            }

        } else {
            firestore().collection('Reaction').add({
                post_id: post_id,
                act_id: user_id,
                doc_id: doc_id,
                time_reacted: new Date().toLocaleTimeString(),
                date_reacted: new Date().toLocaleDateString()
            }).then(resp => {

            }).catch(err => {

            })
        }
    }

    viewDetails = () => {
        console.log('comming soon')
    }
    render() {
        // const post = this.state.posts === null || this.state.posts === undefined ? [] : this.state.posts.reverse()
        return (
            <Container style={styles.container}>
                <Head navigation={this.props.navigation} hideSearch />
                <Content>
                    <ScrollView  >
                        {this.state.posts.map(ps => (
                            <View key={ps._id} style={styles.space}>
                                <Card>
                                    <CardItem>
                                        <Left>
                                            <Thumbnail source={{ uri: ps.author_image }} small />
                                            <Body>
                                                <Text style={{ ...styles.font }}>{ps.author_name}</Text>
                                                <Text note style={{ ...styles.font }}>Target: {ps.target}, {ps.date_posted} - {ps.time_posted}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            {ps.author_email === auth().currentUser.email ? 
                                            <TouchableOpacity style={{padding:10}}
                                             onPress={(e) => this.deletePost(ps._id)}>
                                                <Ant name="delete" size={16} color={'red'} />
                                            </TouchableOpacity> : null}

                                        </Right>
                                    </CardItem>
                                    {ps.image === null ?

                                        <CardItem>
                                            <Text note style={{ ...styles.font, fontSize: 16 }}>
                                                {ps.content}
                                            </Text>
                                        </CardItem>
                                        :
                                        <>
                                            <CardItem cardBody >

                                                <Image source={{ uri: `data:${ps.image.mime};base64,${ps.image.data}` }}
                                                    resizeMethod={"resize"}
                                                    style={{ width: null, height:ps.image.height, flex: 1, resizeMode: "cover" }}
                                                />

                                            </CardItem>
                                            <CardItem>
                                                <Text note style={{ ...styles.font, fontSize: 16 }}>{ps.content}</Text>
                                            </CardItem>
                                        </>}

                                    <CardItem>
                                        <Left>
                                            <TouchableOpacity onPress={(e) => this.toggleReaction(auth().currentUser.email, ps.post_id, ps._id)}>
                                                {this.hasReacted(auth().currentUser.email, ps.post_id) ?
                                                    <Ion name="heart-sharp" size={24} color={'orange'} /> :
                                                    <Ion name="heart-outline" size={24} color={'silver'} />}
                                            </TouchableOpacity>
                                            <Body>
                                                <Text note style={{ ...styles.font, fontSize: 15 }}>{this.getTotalReaction(ps.post_id)}</Text>
                                            </Body>
                                        </Left>
                                        <Right>
                                            <View style={{ flexDirection: 'row' }}>
                                                <View>
                                                    <TouchableOpacity onPress={() => this.setState({ post_id: ps._id, visible: !this.state.visible })}>
                                                        <Ion name="chatbubbles-outline" size={20} />
                                                    </TouchableOpacity>
                                                </View>
                                                <View>
                                                    <Text note style={{ ...styles.font, fontSize: 15 }}>{" " + this.getTotalComment(ps._id)}</Text>
                                                </View>
                                            </View>
                                        </Right>
                                    </CardItem>
                                </Card>
                            </View>

                        ))}

                    </ScrollView>
                    <Comments visible={this.state.visible} post_id={this.state.post_id}
                        closeVisible={() => this.setState({ visible: false })} />
                </Content>
            </Container>
        )
    }
}