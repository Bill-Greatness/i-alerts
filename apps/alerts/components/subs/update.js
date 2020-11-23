import React from 'react'
import { View } from 'react-native'
import { Text, Picker, DatePicker,Toast, Button, Root} from 'native-base'
import { Input } from 'react-native-elements'
import { styles } from '../../assets/styles'
import { firestore, auth } from '../../db'

export default function UpdateForm() {
    const [gender, setGender] = React.useState("")
    const [index, setIndex] = React.useState("")
    const [phone, setPhone] = React.useState("")
    const [course, setCourse] = React.useState("")


    const updateProfile = async () => {

  await auth().currentUser.updateProfile({
      phoneNumber:phone,
      completed:true  
  }).then((resp) => {
      firestore().collection('Users').add({
            user_name:auth().currentUser.displayName,
            user_id:auth().currentUser.uid,
            mail:auth().currentUser.email,
            index_number:index,
            phone:phone,
            course:course, 
            index_number:index,
            gender:gender,
            completed:true
        }).then(resp => Toast.show({
            text:"Profile Updated",
            type:'success',
            buttonText:'okay'
        })).catch(err => Toast.show({
            text:err.message,
            type:'danger',
            buttonText:'okay'
        }))
  }).catch(err => Toast.show({
      text: err, 
      type:'danger',
      buttonText:'okay'
  }))
        
    }
    return (
        <Root>
        <View style={{ ...styles.space }}>
            <Text style={{ ...styles.header, textTransform: 'uppercase', marginBottom: 20, marginTop: 20 }}>Complete Profile</Text>

            <View style={{ width: '50%' }}>
                <Input
                    keyboardType="number-pad"
                    onChangeText={(value) => setIndex(value)}
                    maxLength={10}
                    minLength={10}
                    placeholder='Index Number'
                    style={{ ...styles.font, borderBottomColor: 'white' }}

                />
                <Input
                    autoCompleteType="tel"
                    onChangeText={(value) => setPhone(value)}
                    keyboardType="number-pad"
                    maxLength={10}
                    minLength={10}
                    placeholder='Phone'
                    style={{ ...styles.font, borderBottomColor: "white" }}

                />

                <Picker
                    mode="dialog"
                    style={{ width: undefined, ...styles.font }}
                    selectedValue={course}
                    onValueChange={(value) => setCourse(value)}
                >
                    <Picker.Item label="Select Course" value="" style={styles.font} />
                    <Picker.Item label="Information Technology" value="Information Technology" />
                    <Picker.Item label="Tourism" value="Tourism" />
                    <Picker.Item label="Fashion" value="Fashion" />
                    <Picker.Item label="Graphics" value="Fashion" />
                    <Picker.Item label="Statistics" value="Statistics" />
                </Picker>

                <Picker
                    mode="dialog"
                    style={{ width: undefined, ...styles.font }}
                    selectedValue={gender}
                    onValueChange={(value) => setGender(value)}
                >
                    <Picker.Item label="Select Gender" value="" style={styles.font} />
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                    <Picker.Item label="None" value="None" />
                </Picker>


 

                <Button onPress={updateProfile} style={{marginTop:15}} disabled={!gender || !index || !phone || !course}>
                    <Text style={{...styles.font}}>Update Profile</Text>
                </Button>

            </View>
        </View>
        </Root>

    )
}