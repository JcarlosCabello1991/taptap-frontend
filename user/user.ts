import User from './user.json'
import AsyncStorage from '@react-native-async-storage/async-storage';

export const existsUser = async(): Promise<{ok:boolean, msg:number}> => {
  let resp: {ok:boolean, msg:number}={ok:false, msg:0};

  // if(User.email != "")response = true;
  try {
    const response = await AsyncStorage.getItem("user");
    if(response != null){
      resp = {ok:true, msg: JSON.parse(response).points};
    } else{
      resp = {ok:false, msg: 0};
    }
  } catch (error) {
    console.log(error)
  }
  return resp;
}

export const saveUserinJson = async(email:string, userName:string, points:number) => {
  // User.email = email;
  // User.userName = userName;
  try {
    const jsonValue = JSON.stringify({emailuser:email, username:userName, points: points})
    await AsyncStorage.setItem('user', jsonValue)
  } catch (e) {
    // saving error
    console.log(e)
  }

  existsUser()
}