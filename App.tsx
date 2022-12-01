import { useEffect, useRef, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View,Image } from 'react-native';
import GameContainer from './components/gameContainer/GameContainer';
import CountDown from 'react-native-countdown-component';
import { FormItem } from 'react-native-form-component';
import { existsUser, saveUserinJson } from './user/user';

export default function App() {
  const [error, setError] = useState<string>("");
  const [init, setInit] = useState<boolean>(false);
  const [timer, setTimer] = useState<boolean>(false);
  const [taps, setTaps] = useState<number>(0);
  const [rank, setRank] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [user, setUser] = useState<boolean>(false);
  const [points, setPoints] = useState<number>(0);
  const [ranking, setRanking] = useState<[{_id: string, email:string, userName:string, points:number}]>([{_id:"",email:"", userName:"", points:0}])
  
  useEffect(()=> {
    const isUser = async()=>{
      const response = await existsUser();
      setUser(response.ok);
      if(response.ok) setPoints(response.msg)
    }
    isUser()
  },[])

  useEffect(() => {
    if(rank == true){
      //Fetch to ranking
      const getRanking = async() => {
        const response = await fetch('http://localhost:4000/ranking');
        const data = await response.json();
        console.log(data, "Ranking")
        setRanking(data);
      }
      getRanking()
    }
  },[rank])
  
  const emailInput = useRef();
  const userNameInput = useRef();

  const reset = () => {
    setInit(!init);
    setError("");
    setTimer(false);
  }

  const showTimer = () => {
    setTimer(true)
  }

  const logInAndSignUp = async(action:string) => {
    try{
      const response = await fetch(`http://localhost:4000/${action}`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({userEmail:email, username:userName})
      })

      const data = await response.json();
      console.log(data)
      if(data.ok){
        //Save the info in storage
        saveUserinJson(email, userName, data.msg[0].points);
        setUser(true);
        setPoints(data.msg[0].points);
      }
    }catch(error){
      console.log(error)
    }
  }

  const updatePoints = async(taps:number)=> {
    try{
      const response = await fetch(`http://localhost:4000/points`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body: JSON.stringify({userEmail:email, username:userName, points: taps})
      })

      const data = await response.json();
      console.log(data)
      if(data.ok){
        //Save the info in storage
        saveUserinJson(email, userName, data.msg.points);
        setUser(true);
        setPoints(data.msg.points);
        setTaps(0);
      }
    }catch(error){
      console.log(error)
    }
  }

  const renderItem = ({item, index}:any) => {
    console.log(index)
    return <Item index={index} name={item.userName} userPoints={item.points}/>
  }

  const Item = ({index, name, userPoints}:{index: number,name:string, userPoints: number}) => {
    return (
      <View style={styles.viewItem}>
        <Text style={styles.textItem}>#{index+1}</Text>
        <Text style={styles.textItemName}>{name.length < 17 ? name : name.substring(0,15)}</Text>
        <Text style={styles.textItem}>{userPoints}</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{width:'100%', height:'20%', marginBottom:'2rem', maxHeight:'14rem', maxWidth:'15rem'}}>
        <Image source={require('./assets/taptap.png')} style={{width:'100%', height:'100%'}}/>
      </View>
      {
        !user ?
        <View style={{borderColor:'black', borderWidth:2, borderRadius:10, width:'370px', display:'flex', alignItems:'center', paddingVertical:10}}>
          <FormItem label="Email"
            isRequired
            value={email}
            onChangeText={(email) => setEmail(email)}
            asterik
            textInputStyle={{border:'1px solid #ccc', borderRadius:'5px'}}
            ref={emailInput}/>
          <FormItem label="Username"
            isRequired
            value={userName}
            onChangeText={(userName) => setUserName(userName)}
            asterik
            textInputStyle={{border:'1px solid #ccc', borderRadius:'5px'}}
            ref={userNameInput}/>
          <View style={{display:'flex', flexDirection:'row', justifyContent:'space-around', width:'50%'}}>
            <Button title='login' onPress={()=>{logInAndSignUp("logIn")}} />
            <Button title='Sign up' onPress={()=>{logInAndSignUp("signUp")}}/>
          </View>
        </View>   
        :
        <>
        <View style={styles.containerTaps}>
          <View style={styles.taps}>
            <Text>
              Your Max. taps: {points}
            </Text>
          </View>
          <View style={styles.yourTaps}>
            <Text>
              Game taps: {taps}
            </Text>
          </View>        
        </View>
        <GameContainer setError={setError} init={init} timer={timer} setTimer={setTimer} setTaps={setTaps} taps={taps} updatePoints={updatePoints}/>
        {
        error != "" && 
          <dialog style={styles.dialog} open>
            <Text>
              {error}
            </Text>
            <Button title='Play Again' onPress={reset}/>
          </dialog>
        }
        {
          rank && 
          <dialog style={styles.dialogRanking} open>
            <View style={{width:'100%', height:'20rem'}}>
              <FlatList 
                data={ranking}
                renderItem={renderItem}
                keyExtractor={item => item._id}
              />
              <Button title='Okey' onPress={()=>{setRank(false)}}/>
            </View>            
          </dialog>
        }
        <View style={{marginTop:'1rem'}}>
        {
          timer && 
          <CountDown
          until={30}
          onFinish={() => {setError("Congrats, Do you want to play again?"); setTimer(false), updatePoints(taps)}}
          timeToShow={['S']}
          size={20}
          />
        }
        </View>
        {
          !timer && <View style={styles.btnsContainer}><Button title='Ranking' onPress={()=>{setRank(true)}}/><Button title='Play' onPress={showTimer}/></View>
        }
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight:'896px'
  },
  containerTaps:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    width:'88%',
    maxWidth:'414px'
  },
  taps:{
    backgroundColor:'gold',
    borderColor:'black',
    borderWidth:2,
    borderRadius:25,
    paddingHorizontal:5,
    marginBottom:'0.25rem'
  },
  yourTaps:{
    backgroundColor:'#9ef06b',
    borderColor:'black',
    borderWidth:2,
    borderRadius:25,
    paddingHorizontal:5,
    marginBottom:'0.25rem'
  },
  dialog:{
    borderRadius:10
  },
  btnsContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    width:'88%',
    maxWidth:'414px'
  },
  dialogRanking:{
    borderRadius:10,
    width:'50%',
    height:'20rem'
  },
  viewItem:{
    display:'flex', 
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-around', 
    marginBottom:5, 
    backgroundColor:'gold'
  },
  textItem:{
    width:'20%'
  },
  textItemName:{
    width:'60%'
  }
});
