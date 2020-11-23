import React from 'react'
import { Overlay, Input } from 'react-native-elements'
import { Picker, Form, Text, Textarea, Button } from 'native-base'
import { View, TextInput, TouchableOpacity } from 'react-native'
import { styles } from '../../assets/styles'
import Ion from 'react-native-vector-icons/Ionicons'
import { auth, firestore } from '../../db'
import uuid from 'uuid'


export default function AddNotes({ show_pad, closePad }) {

    const [heading, setHeading] = React.useState('')
    const [content, setContent] = React.useState('')
    const [target, setTarget] = React.useState('')

    const sendNotification = () => {
        firestore().collection('Notification').add({
            heading: heading.trim(),
            content: content.trim(),
            target:target,
            sender: auth().currentUser.email,
            sender_name: auth().currentUser.displayName,
            date_sent: new Date().toLocaleDateString(),
            time_sent: new Date().toLocaleTimeString(),
            author_image:auth().currentUser.photoURL,
            notification_id: uuid.v4()
        }).then(resp => {
            setHeading(''); setContent('');
            closePad();
        }).catch(err => {

        })
    }
    return (
        <Overlay isVisible={show_pad}>
            <View style={{ minWidth: '50%', maxWidth: '65%', minHeight: '50%' }}>
                <Text style={{ ...styles.font, marginBottom: 10 }}>Send New Information</Text>
                <Form >
                    <View style={{ height: 50 }}>
                        <Picker
                        note
                            mode="dialog"
                           
                            selectedValue={target}
                            onValueChange={value => setTarget(value)}
                        >
                            <Picker.Item label="Select Target" value="" />
                            <Picker.Item label="All Students" value="All Students" />
                            <Picker.Item label="First Years'" value="First Year Students" />
                            <Picker.Item label="Second Years'" value="Second Year Students" />
                            <Picker.Item label="Final Years'" value="Final Year Students" />
                            <Picker.Item label="BTech Students" value="BTech Students" />
                            <Picker.Item label="Evening Students" value="Evening Students" />
                        </Picker>
                    </View>
                    <Text note style={{ ...styles.font, marginBottom: 20 }}>Info Title </Text>
                    <TextInput value={heading} placeholder="Heading" style={{ ...styles.font, fontSize:20 }} onChangeText={text => setHeading(text)} />

                    <Text note style={{ ...styles.font, marginTop: 20, marginBottom: 20 }}>Info Content </Text>
                    <Textarea value={content} placeholder="Content Here" onChangeText={info => setContent(info)}
                        style={{ ...styles.font, fontSize:17}} maxLength={250}
                        rowSpan={5} bordered />

                    <Button disabled={!heading || !content || !target} onPress={() => sendNotification()}
                        success small style={{ marginTop: 20 }}>
                        <Text style={styles.font}>Send Notification</Text>
                    </Button>
                </Form>
                <TouchableOpacity onPress={() => closePad()} style={{ padding: 10, position: 'absolute', right: 0, bottom: 0 }}>
                    <Ion name="close-circle" color={'red'} size={30} />
                </TouchableOpacity>
            </View>
        </Overlay>
    )
}