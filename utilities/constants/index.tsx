import { Dimensions } from 'react-native'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const cObj = {
    "NGN": "₦",
    "USD": "$",
}

const cObj2 = {
    "NGN": "",
    "USD": "",
    "₦": "",
    "$": ""
}
const ENV = "PRODUCTION"  // CHANGE TO "TEST" OR "PRODUCTION"
const PRODUCTION_BASE_URL = "https://puzzleint.azurewebsites.net/"
const TEST_BASE_URL = "http://apekflux-001-site11.btempurl.com/" 
const BASE_URL = (ENV == "PRODUCTION")?PRODUCTION_BASE_URL:(ENV == "TEST")?TEST_BASE_URL:""
export { SCREEN_HEIGHT, SCREEN_WIDTH, cObj, cObj2, BASE_URL }