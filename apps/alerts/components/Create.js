import React from 'react'
import { StatusBar, TouchableOpacity, View, Image, ToastAndroid } from 'react-native'
import { Container, Content, Text, Textarea, Form, Button, Picker } from 'native-base'
import { styles } from '../assets/styles'
import uuid from 'uuid'

import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Ion from 'react-native-vector-icons/Ionicons'
import Head from '../layout/Header'

import { firestore, auth, storage } from '../db'
import ImagePicker from 'react-native-image-crop-picker';

export default class Create extends React.Component {
    constructor() {
        super()
        this.state = {
            content: "",
            image: null,
            image_path: null,
            target: ''
        }
    }

 showToast = (message) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
     }
    getImage = event => {
        ImagePicker.openPicker({
            multiple: false,
            cropping:true,
            mediaType: 'photo',
            includeBase64: true
        }).then(image => {
            this.setState({ image: image, image_path: image.path })
        }).catch(err => {
            console.log(err)
        });
    }

    getImageFromCamera = event => {
        ImagePicker.openCamera({
            width: 300,
            height: 250,
            mediaType:'photo'
        }).then(image => {
            this.setState({ image: image, image_path: image.path })
        }).catch(err => {
            console.log(err)
        });
    }

    submitContent = async () => {
        const { content, image, target } = this.state

        await firestore().collection('Content').add({
            content:content.trim(),
            image,
            author_id: auth().currentUser.uid,
            author_image: auth().currentUser.photoURL,
            author_email: auth().currentUser.email,
            author_name: auth().currentUser.displayName,
            post_id: uuid.v4(),
            date_posted: new Date().toLocaleDateString(),
            time_posted: new Date().toLocaleTimeString(),
            target: target
        }).then(resp => {
            this.setState({ content: '', image: null, image_path: null }, () => this.showToast('Posted !'))
        }).then(resp => {
            this.props.navigation.navigate("Home")
        }).catch(err => {
            console.log(err.message)
        })
    }


    render() {


        return (
            <Container style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Head hideSearch={true} navigation={this.props.navigation} />

                <Content style={{ ...styles.space, marginTop: 20 }} padder>

                    <Text style={styles.header}>Create Post</Text>
                    <Text note style={{ ...styles.font, fontSize: 18 }}>Announcements, Adverts and More {"\n"}</Text>

                    <Form>

                        <Textarea style={{ ...styles.font }} maxLength={250} rowSpan={5} bordered value={this.state.content}
                            onChangeText={text => this.setState({content:text})} />

                    </Form>
                    <View style={{ flex: 1, justifyContent: 'space-between', marginTop: 25 }}>
                        <View style={{ marginTop: 15 }}>
                            <Text style={{ marginBottom: 5, ...styles.font }}>Upload Photo</Text>
                            <View style={{ width: 100, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ paddingRight: 10 }}>
                                    <TouchableOpacity onPress={this.getImage}>
                                        <Ion name="images-outline" size={20} />
                                    </TouchableOpacity>
                                </View>

                                <View style={{ paddingRight: 20 }}>
                                    <TouchableOpacity onPress={this.getImage}>
                                        <Icon name="camera" size={20} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={{ marginTop: 15 }}>
                            <Form>
                                <Picker
                                    note
                                    mode="dropdown"
                                    style={{ width: 150, fontFamily:'Sen-Regular' }}
                                    selectedValue={this.state.target}
                                 onValueChange={value => this.setState({target:value})}
                                >
                                    <Picker.Item label="Select Target" value="" />
                                    <Picker.Item label="All" value="All Students" />
                                    <Picker.Item label="All First Year's" value="First Year's" />
                                    <Picker.Item label="All Second Year's" value="Second Year's" />
                                    <Picker.Item label="All Final Year's" value="Final Year's" />
                                    
                                </Picker>
                            </Form>
                        </View>


                    </View>

                    <Button disabled={!this.state.content || !this.state.target} onPress={() => this.submitContent()} success rounded style={{ marginTop: 25 }}>
                        <Text style={{ ...styles.font }}>Post Content</Text>
                    </Button>

                    <View style={{ flex: 1, marginTop: 15 }}>
                        <Image source={{ uri: this.state.image_path }} style={{ width: null, height: 350, resizeMode: 'cover' }} />
                    </View>
                </Content>
            </Container>
        )
    }
}