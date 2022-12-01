import React, { useEffect, useState } from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import TapContainer from '../TapContainer/TapContainer'

type Props = {
  setError: React.Dispatch<React.SetStateAction<string>>,
  init:boolean,
  setTimer: React.Dispatch<React.SetStateAction<boolean>>,
  setTaps:React.Dispatch<React.SetStateAction<number>>,
  timer:boolean, 
  taps:number,
  updatePoints: Function
}

function GameContainer({setError, init, setTimer, setTaps, timer, taps, updatePoints}:Props) {
  const [currentWidth, setCurrentWidth] = useState<number>(window.innerWidth > 414 ? 414 : window.innerWidth);
  const [currentHeight, setCurrentHeight] = useState<number>(window.innerHeight > 896 ? 896 : window.innerHeight);

  return (
    <View style={styles.containerGame}>
      <TouchableOpacity style={{width:'100%', height:'100%',backgroundColor:'#9ef06b'}} onPress={()=>{if(timer){setError("Oops, try another game to win the award!!"); setTimer(false), updatePoints(taps)}}}/>
      <TapContainer init={init} setTaps={setTaps} timer={timer} currentWidth={currentWidth} currentHeight={currentHeight}/>
    </View>
  )
}

const styles = StyleSheet.create({
  containerGame:{
    width:'90%',
    maxWidth:'414px',
    height:'50%',
    maxHeight:'896px',
    borderColor:'#0c94b6',
    borderWidth:2,
    borderRadius:5,
  }
})

export default GameContainer