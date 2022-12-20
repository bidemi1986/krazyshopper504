import { ActivityIndicator, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { fetch_all_products } from "../functions/product-api/product-functions";
import tailwind from "twrnc";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { useEffect, useState, useCallback, useContext } from "react";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { theme } from "../theme/core/theme";
import { buyProduct } from "../functions/product-api/product-functions";  
import ImageHolder from "../components/ShopComps/ImageHolder";
import C504Default from "./AuthScreens/style";
import { Context } from "../context";

type Product = {
  name: string;
  iamge: string;
  price: number;
};
export default function ProductScreen({ navigation, route }) {
  const {state, dispatch} = useContext(Context)
  const [product, setProduct] = useState({});
  const [indicator, setIndicator] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
   // fetchProducts();
  }, []);
  const buy_product = async () => {
    setRefreshing(true);
    let res: any = await buyProduct(route?.params?.id || "");
    console.log("res  => ", res.data);
    setProduct(res.data);
    await fetchProducts()
    Alert.alert("Product successfully purchased!")
    navigation.goBack() 
    setRefreshing(false); 
  };
  const fetchProducts = async () => { 
    let res: any = await fetch_all_products();
    console.log("res  => ", res.data); 
    dispatch({
      type: "ADD_PRODUCTS",
      payload: res.data,
    }); 
  };

  useEffect(() => {
    // onRefresh(); 
    // console.log(" route iss ", route.params);
    // console.log("Product iss ", product);
    setProduct(route.params)
  }, [route.params]);
  return (
    <View style={[tailwind`w-full flex`, { backgroundColor: "white" }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          tailwind`flex bg-[${theme.colors.lightbrown2}] mx-auto  w-full self-center`,
          {
            paddingBottom: 100,
          },
        ]}
      >
        <View
          style={[
            tailwind`w-full  flex-wrap flex-row p-2 flex flex-row items-center justify-between`,
          ]}
        >
          <ImageHolder product={ route.params} />
        </View>
        <View style={[tailwind`bg-[#fff]  p-4`]}>
          <Text
            style={[tailwind`text-lg text-left font-bold overflow-hidden`]}
            numberOfLines={1}
          >
            {product?.name || ""}
          </Text>
          <Text
            style={[tailwind`text-lg text-left overflow-hidden`]}
            numberOfLines={1}
          >
            {product?.description || ""}
          </Text>
          <Text
            style={[tailwind`text-lg text-left italic  overflow-hidden`]}
            numberOfLines={1}
          >
            {product?.product || ""}
          </Text>
          <Text
            style={[tailwind`text-lg text-left italic  overflow-hidden`]}
            numberOfLines={1}
          >
           {route.params?.amount || 0}  <Text style={{opacity:0.4, color: "#333"}}>{product?.amount == 0? "out of stock":"in Stock"}</Text>
          </Text>
          <Text style={[tailwind`text-lg text-left font-bold overflow-hidden`]}>
            {product?.price || ""}
          </Text>
          <TouchableOpacity
          disabled={indicator}
          onPress={async () => {
            buy_product()
          }}
          style={[
            tailwind`bg-[${theme.colors.lightbrown1}] w-full p-4 rounded-md my-3 mb-6`,
          ]}
        >
          {indicator === true ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Buy</Text>
          )}
        </TouchableOpacity>
        </View> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  containerContent: C504Default.containerContent,
  formContainer: C504Default.formContainer,
  inputStyle: C504Default.PostCard.commentInputStyle,
  boxLabel: C504Default.boxLabel,
  important: C504Default.important,
  submitButton: C504Default.submitButton,
  fbButton: C504Default.fbButton,
  buttonText: C504Default.buttonText,
  topMenuStrip: C504Default.topMenuStrip,
  dropdown: {
    backgroundColor: "#F8F5F6",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#D2416C33",
    padding: 12,
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginBottom: 10,
    minHeight: 44,
    letterSpacing: 0.64,
  },
});
