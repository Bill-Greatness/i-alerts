import {StyleSheet} from 'react-native'

export const colors = {
    dark:'#dark',
    light:'#fff',
    background:'#A24823'
}

export const styles = StyleSheet.create({
   container:{
    backgroundColor:'#fff',
    flex:1,
    fontFamily:'Sen-Regular'
  
   },
   badge:{
     backgroundColor:'#fff',
     fontFamily:'Sen-Regular',
     color:'red'
   },
   font:{
        fontFamily:'Sen-Regular',
   },
   tabBar:{
        fontFamily:'Sen-Regular', 
        backgroundColor:'#A24823'
   },
   tabFont:{
        fontFamily:'Sen-Bold',
        fontSize:13,
        color:'#fff'
   },
   space:{
    marginLeft:10,
    marginRight:10,
   },
   header:{
        fontSize:20, 
        fontWeight:"800",
        textTransform:'uppercase',
        fontFamily:'Sen-Bold',
   },
   center:{
       textAlign:'center',
       alignSelf:'center',
       justifyContent:'center',
       alignContent:'center'
   },
   modalContainer:{
    margin:10, 
    alignSelf:'center',
    justifyContent:'center',
    minHeight:'40%',
    maxWidth:'60%',
    backgroundColor:'#003366'
   }

})

