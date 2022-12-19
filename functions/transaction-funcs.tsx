import { mapTimeToTransactions } from "../utilities/helpers";
import { resolveTotalDebit } from "../utilities/helpers";
import { resolveTotalCredit } from "../utilities/helpers";
const fetchdata = (url: string) => {
  console.log("url passed to fetchdata is ", url);
  return new Promise(async (resolve, reject) => {
    try {
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBjZDM4NGRjM2I3ZjAwNDE1ZWVlN2MiLCJpYXQiOjE2NTM0MDMzMjZ9.Ez__0atRtDGJ3VZ3glzU5_GCdXMsC41iiMKEsmdVpnI",
        },
        method: "GET",
        mode: "cors",
      });
      let r2 = await res.json();
      console.log("res received is ", r2);
      resolve({ data: r2 });
    } catch (err) {
      console.log("something went wrong fetching data fetchdata...", err);
      reject({ msg: "ERROR", error: "something went wrong " });
    }
  });
};
const fetchBalance = (recordId: string) => {
    console.log("recordId passed to fetchBalance is ", recordId); 
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("https://api.okra.ng/v2/callback?record={recordId}&method=CHECK_BALANCE", {
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjBjZDM4NGRjM2I3ZjAwNDE1ZWVlN2MiLCJpYXQiOjE2NTM0MDMzMjZ9.Ez__0atRtDGJ3VZ3glzU5_GCdXMsC41iiMKEsmdVpnI",
          },
          method: "GET",
          mode: "cors",
        });
        let r2 = await res.json();
        console.log("res received is ", r2);
        resolve({ data: r2 });
      } catch (err) {
        console.log("something went wrong fetching data fetchdata...", err);
        reject({ msg: "ERROR", error: "something went wrong " });
      }
    });
  };
export const fetch_transactions = async (url: Array) => {
  // console.log(" url passed is ", url.length)
  return new Promise(async (resolve, reject) => {
    try {
      let response = await Promise.all(
        url.map((u) => {
          return fetchdata(u);
        })
      );
      let TRANS = [];
      response.forEach((r2) => {
        // console.log(" r2.data", r2.data)
        let result = r2.data.data?.transactions || [];
        TRANS = [...TRANS, ...result];
      });
      console.log("transactions fetched are ...", response.length, "TRANS length ...", TRANS.length);
      if(TRANS.length === 0){
        resolve({
            msg: "NO TRANSACTIONS",
            data: {
              transactions: TRANS,
              timeCarousel: null,
              totalDebit:0,
              totalCredit:0,
            },
          });
      }else{
        let timeCarousel = mapTimeToTransactions(TRANS);
        let totalDebit = resolveTotalDebit(TRANS);
        let totalCredit = resolveTotalCredit(TRANS);
  
        resolve({
          msg: "SUCCESS",
          data: {
            transactions: TRANS,
            timeCarousel,
            totalDebit,
            totalCredit,
          },
        });
      }
     
    } catch (err) {
      console.log("somethign went wrong fetching data...", err);
      reject({ msg: "ERROR", error: "something went wrong" + err.toString() });
    }
  });
};
