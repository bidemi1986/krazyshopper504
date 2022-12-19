import { Dimensions } from 'react-native';
import Constants  from 'expo-constants';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const stat = Constants.statusBarHeight;

const SizeW = (value:any) =>{
    const design_width = 428;   
    const device_width = Dimensions.get("window").width;
    let ratio = (value / design_width) 
    // let ratioo = Math.round(ratio)

    return (ratio * device_width)  
 }

 const SizeH = (value:any) =>{
    const design_height = 922;   
    const device_height = (Dimensions.get("window").height) - (stat) ;
    let ratio = (value / design_height)
    
    return (`${Math.round(ratio * device_height)}` )  
 }

 export  {SizeW, SizeH};



