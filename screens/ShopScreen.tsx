import { StyleSheet } from "react-native";
import { fetch_all_products } from "../functions/product-api/product-functions";
import tailwind from "twrnc";
import { useContext } from "react";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import { useEffect, useState, useCallback } from "react";
import { ScrollView, RefreshControl } from "react-native-gesture-handler";
import { theme } from "../theme/core/theme";
import { getUserDetails } from "../functions/user-api/user-funcs";
import ProductCard from "../components/ShopComps/ProductCard";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "../utilities/constants";
import { Context } from "../context";
type Product = {
  name: string,
  iamge: string
  price: number

}
export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const { state, dispatch } = useContext(Context);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = useCallback(async () => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setRefreshing(true);
    let res: any = await fetch_all_products();
    console.log("res  => ", res.data);
    setProducts(res.data);
    dispatch({
      type: "ADD_PRODUCTS",
      payload: res.data,
    });
    setRefreshing(false);
  };

  useEffect(() => {
    onRefresh();
  }, []);
  return (
    <View style={[tailwind`w-full flex `, { backgroundColor: "white", }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          tailwind`flex bg-[${theme.colors.lightbrown1}] mx-auto  items-center w-full self-center`,
          {
            minHeight: SCREEN_HEIGHT
          },
        ]}
      >
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View
          style={[
            tailwind`w-full bg-[${theme.colors.lightbrown2}] flex-wrap flex-row p-2 flex flex-row items-center justify-around`,
            { paddingBottom: 100, minHeight: SCREEN_HEIGHT }
          ]}
        >
          {state.products.map((product, i) => {
            if (state.products.length == 0) return
            return <ProductCard product={product} key={i} width={0.45 * SCREEN_WIDTH} height={0.3 * SCREEN_HEIGHT} />;
          })}
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
