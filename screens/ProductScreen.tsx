import { StyleSheet } from "react-native";
import { fetch_all_products } from "../functions/product-api/product-functions";
import tailwind from "twrnc";
import { Text, View } from "../components/Themed";
import { RootStackParamList } from "../types";
import { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { theme } from "../theme/core/theme";
import ProductCard from "../components/ShopComps/ProductCard";  
import ImageHolder from "../components/ShopComps/ImageHolder";

type Product = {
  name : string,
  iamge : string
  price : number

}
export default function ProductScreen({navigation, route}) {
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    setRefreshing(true);
    let res: any = await fetch_all_products();
    console.log("res  => ", res.data);
    setProducts(res.data);
    setRefreshing(false);
  };

  useEffect(() => {
   // onRefresh();
   console.log(" route ", route.params)
  }, []);
  return (
    <View style={[tailwind`w-full flex`, { backgroundColor: "white" }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          tailwind`flex bg-[${theme.colors.lightbrown2}] mx-auto items-center w-full self-center`,
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
             <ImageHolder product={route.params}/>
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
});
