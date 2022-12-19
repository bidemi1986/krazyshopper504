import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timestamp } from "@firebase/firestore";
async function SecureSave(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

async function SecureGet(key: string) {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    // console.log("🔐 Here's your value 🔐 \n" + result);
    return result;
  } else {
    console.warn("No values stored under that key.");
  }
}

const storeObjectDataAsync = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
    console.warn("something went wrong fetching ", key, "locally");
  }
};
const storeStringDataAsync = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.warn("something went wrong fetching ", key, "locally");
  }
};
const getStoredDataAsync = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      return JSON.parse(value);
    } else {
      console.log("getStoredDataAsync: omo no products here 0!");
      return null;
    }
  } catch (e) {
    // error reading value
    return null;
  }
};

const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
    console.log(timeout, " wait is over...");
  });
};
function formatMoney(n: number, currency: string) {
  let result: string | number  = "" 
  let sign = n <0 ? -1 : 1
  if( sign <0){
    n= n*-1
  }
   result = currency +
    n.toFixed(2).replace(/./g, function (c, i, a) {
      return i > 0 && c !== "." && (a.length - i) % 3 === 0 ? "," + c : c;
    }) 
    return (sign < 0 ? ("-"+result) : result)
}
function convertTime(time: Timestamp) {
  if (!time) return;
  //console.log("time received is: ", time)
  const MONTHS: object = {
    1: "Jan",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "May",
    6: "Jun",
    7: "Jul",
    8: "Aug",
    9: "Sep",
    10: "Oct",
    11: "Nov",
    12: "Dec",
  };
  let d: Date = new Date();
  //console.log("time data passed is:", time)
  //let d = new Date(time._seconds * 1000)
  //let d = new Date(time)
  if (time.hasOwnProperty("seconds")) {
    d = new Date(time.seconds * 1000);
  } else if (time.hasOwnProperty("_seconds")) {
    d = new Date(time._seconds * 1000);
  } else {
    return;
  }

  //console.log("converted time is:", d)
  let dYear = d.getFullYear();
  let dMonth = d.getMonth() + 1;
  let dDate = d.getDate();
  let dHours = d.getHours();
  let dMinutes = d.getMinutes();
  let dSeconds = d.getSeconds();
  let currentTime = new Date();
  let minutes = currentTime.getMinutes();
  let month = currentTime.getMonth() + 1;
  let date = currentTime.getDate();
  let hours = currentTime.getHours();
  let year = currentTime.getFullYear();
  let seconds = currentTime.getSeconds();
  //console.log("dYear is: ", dYear, "dMonth  is: ", dMonth, " dHours  is: ",dHours, " dDate  is: ",dDate, " dminutes ", dMinutes, "dseconds: ", dSeconds)
  //console.log("Year is: ", year, "Month  is: ", month, " dHours  is: ",dHours, " dDate  is: ",dDate, " minutes ", minutes, "seconds: ", seconds)

  let fullTime = "";

  if (month == dMonth && year == dYear && date !== dDate) {
    let diff = date - dDate;
    fullTime = diff > 1 ? `${diff}d ago` : `${diff}d ago`;
  } else if (month == dMonth && year == dYear && date == dDate) {
    let diff = hours - dHours;

    if (diff >= 1) {
      fullTime = diff > 1 ? `${diff}h ago` : `${diff}h ago`;
    } else if (minutes - dMinutes >= 1) {
      let diffm = minutes - dMinutes;
      fullTime = diffm > 1 ? `${diffm}m ago` : `${diffm}m ago`;
    } else {
      let diffs = seconds - dSeconds;
      fullTime = diffs > 1 ? `${diffs}s ago` : `${diffs}s ago`;
    }
  } else if (month - dMonth == 1 && year == dYear) {
    // console.log("date= ",date," dDate= ",date-dDate )
    let diff = 30 + dDate - date;
    if (dDate < 0) {
      diff = 30 + dDate - date;
    } else {
      diff = 30 - dDate + date;
    }

    fullTime = diff > 1 ? `${Math.abs(diff)}d ago` : `${Math.abs(diff)}d ago`;
  } else if (month !== dMonth && year == dYear) {
    let diff = month - dMonth;
    fullTime = diff > 1 ? `${diff}mths ago` : `${diff}mth ago`;
  } else {
    fullTime = `${MONTHS[dMonth]} ${dDate}, ${dYear}`;
  }

  //console.log(" fulltime is: ", fullTime)
  return fullTime;
}
export { SecureSave, SecureGet, convertTime, wait, formatMoney, storeObjectDataAsync, storeStringDataAsync, getStoredDataAsync };

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const resolveTimeString = (timestring: Date) => {
  let d = new Date(timestring);
  let dYear = d.getFullYear();
  let dMonth = monthNames[d.getMonth()];
  let dDate = d.getDate();
  let dDay = d.toLocaleString(  'default', {weekday: 'short'});
  let dHours = d.getHours();
  let dMinutes = d.getMinutes();
  let dSeconds = d.getSeconds();
  let depochMillis = d.getTime();
  let currentTime = new Date();
  let minutes = currentTime.getMinutes();
  let month = currentTime.getMonth() + 1;
  let day = currentTime.toLocaleString(  'default', {weekday: 'short'});
  let date = currentTime.getDate();
  let hours = currentTime.getHours();
  let year = currentTime.getFullYear();
  let seconds = currentTime.getSeconds();
  let epochMillis = currentTime.getTime();
  return {
    d,
    dYear,
    dMonth,
    dDate,
    dDay,
    dHours,
    dMinutes,
    dSeconds,
    depochMillis,
    currentTime,
    minutes,
    month,
    day,
    date,
    hours,
    year,
    seconds,
    epochMillis,
  };
};
type TRANSACTIONS = {
  _id: null | string | number;
  amount: number;
  category: null | string;
  date: Date;
  narration: string;
  type: "debit" | "credit";
};
type TRANS_TABLE = {
  [key: string]: {
    transactions: TRANSACTIONS[];
    totalDebit: number;
    totalCredit: number;
  };
};
export const mapTimeToTransactions = (transactions: TRANSACTIONS[]) => {
  /* 	let results = transactions.map(trans =>{
		return resolveTimeString(trans.trans_date)
	}) */
  if (!transactions || !Array.isArray(transactions)) return;
  //console.log("trnsactions passed are: ", transactions)
  let sorted = transactions.sort((x, y) => {
    let date1: any = new Date(x.date);
    let date2: any = new Date(y.date);
    return date1 - date2;
  });
  let transaction_Table: TRANS_TABLE = {};
  sorted.forEach((item) => {
    let month = resolveTimeString(item.date).dMonth;
    let year = resolveTimeString(item.date).dYear;
    let key = month + " " + year;
    let data = transaction_Table[key]?.transactions || [];
    transaction_Table[key] = { ...transaction_Table[key], transactions: [...data, item] };
  });
  let KEYS = Object.keys(transaction_Table);
  KEYS.forEach((key) => {
    let trans = transaction_Table[key]?.transactions || [];
    transaction_Table[key] = { ...transaction_Table[key], totalDebit: resolveTotalDebit(trans) };
    transaction_Table[key] = { ...transaction_Table[key], totalCredit: resolveTotalCredit(trans) };
  });
  return transaction_Table;
};

export const resolveTotalDebit = (transactions: TRANSACTIONS[]) => {
  let results = 0;
  transactions.forEach((trans) => {
    if (trans.type === "debit") {
      results = results + trans?.amount || 0;
    }
  });
  return results;
};
export const resolveTotalCredit = (transactions: TRANSACTIONS[]) => {
  let results = 0;
  transactions.forEach((trans) => {
    if (trans.type === "credit") {
      results = results + trans?.amount || 0;
    }
  });
  return results;
};
