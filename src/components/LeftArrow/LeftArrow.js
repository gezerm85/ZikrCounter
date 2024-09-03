import { StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { img } from '../../utils/img/img'
import { useNavigation } from '@react-navigation/native'

const LeftArrow = () => {
    const nav = useNavigation()
  return (
    <TouchableOpacity style={styles.container} onPress={()=> nav.goBack()}>
      <Image style={styles.img} source={img.leftArrow}/>
    </TouchableOpacity>
  )
}

export default LeftArrow

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 16,
    },
    img:{
        height: 48,
        width: 48,
    },
})