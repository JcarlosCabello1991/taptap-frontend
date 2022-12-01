import React, { useEffect, useState } from 'react'
import {View, StyleSheet, Text, Button, TouchableOpacity, Image} from 'react-native'

type Props = {
  init:boolean,
  setTaps:React.Dispatch<React.SetStateAction<number>>,
  timer:boolean,
  currentWidth:number,
  currentHeight: number
}

function TapContainer({init, setTaps, timer, currentWidth, currentHeight}:Props) {

  const getInitialHeight = () => {
    return ((currentHeight*0.5 / 2) - 16);
  }

  const getInitialWidth = () => {
    return ((currentWidth / 2*0.9) -16);
  } 

  const [height, setHeight] = useState<number>(getInitialHeight());
  const [width, setWidth] = useState<number>(getInitialWidth());

  useEffect(() => {
      setWidth(getInitialWidth);
      setHeight(getInitialHeight);
  },[init])

  const newPosition = () => {
    setTaps((prevState) => (prevState+1))
    setNewWidth();
    setNewHeigth();
  }

  const setNewWidth = () => {
    let newWidth:number = 0;
    do{
      newWidth = Math.floor(Math.random()*(currentWidth*0.9-currentWidth*0.1));
    }while(newWidth == width);
    setWidth(newWidth);
  } 

  const setNewHeigth = () => {
    let newHeight:number = 0;
    do{
      newHeight = Math.floor(Math.random()*(currentHeight*0.70-currentHeight*0.25));
    }while(newHeight == height);
    setHeight(newHeight);
  }

  return (
    <View style={{width:'32px',height:'32px', borderRadius:50, marginTop:`${height}px`, marginLeft:`${width}px`, position:'absolute'}}>      
      <TouchableOpacity style={[styles.button]} onPress={()=>{timer && newPosition()}}>
        <Image source={require('../../assets/pelota.png')} style={styles.button}/>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  button:{
    width:'32px',
    height:'32px',
    borderRadius:50
  }
})

export default TapContainer