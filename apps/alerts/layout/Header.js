import React from 'react'
import { TextInput, View, TouchableOpacity, Text } from 'react-native'
import { auth } from '../db'
import Ent from 'react-native-vector-icons/Entypo'
import Ant from 'react-native-vector-icons/AntDesign'
import Fea from 'react-native-vector-icons/Feather'
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Header, Button} from 'native-base'
import { styles, colors } from '../assets/styles'

export default function Head({ navigation, hideSearch, currentScreen, showNote,openNotePad }) {

    return (
        <Header searchBar transparent style={{ justifyContent: "space-between", borderBottomColor: 'none', backgroundColor: colors.background }}>


            {hideSearch ? null : <Fea name="search" size={24} style={styles.center} color={colors.light} />}


            <View style={styles.center}>
                {currentScreen === undefined ?
                    <TouchableOpacity onPress={(e) =>
                        navigation.navigate("Home")
                    }>
                        <Ent name="feather" size={24} color={colors.light} />
                    </TouchableOpacity> : <Text style={{ ...styles.header, ...styles.center, color: colors.light }}>{currentScreen}</Text>}
            </View>

            {showNote ?
                <TouchableOpacity style={{ padding: 10 }} onPress={() => openNotePad()}>
                    <MIcon name="bell-plus" size={24} color={colors.light} />
                </TouchableOpacity>
                :
                <TouchableOpacity onPress={(e) => auth().signOut()}
                    style={{ ...styles.center, paddingLeft: 10, paddingRight: 10 }}>
                    <Ant name="logout" size={24} color={colors.light} />
                </TouchableOpacity>
            }
        </Header>
    )
}