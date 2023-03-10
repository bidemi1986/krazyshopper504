import { isEmpty } from 'lodash';
import { StyleSheet } from "react-native";
import { fetch_all_products, getTotalProductPrice } from "../functions/product-api/product-functions";
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
import { startAfter } from "firebase/firestore";
type Product = {
  name: string;
  iamge: string;
  price: number;
};
export default function TabTwoScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const { state, dispatch } = useContext(Context);
  const [products, setProducts] = useState([]);



  const [refreshing, setRefreshing] = useState(true);
  const onRefresh = useCallback(async () => {
    //fetchProducts();
  }, []);
  const updateCart = () => {
    if (state.cart.length == 0) return
    if (state.products.length == 0) return
    let cartProducts: Array<Object> = [];
    state.cart.forEach((cart_item_id: string) => {
      let temp = state.products.filter((item) => {
        if (item.id == cart_item_id) return true;
      });
      cartProducts = [...temp, ...cartProducts];
    });
    setProducts(cartProducts)
  };

  useEffect(() => {
    updateCart()
  }, [state.cart, state.products]);
  return (
    <View style={[tailwind`w-full flex `, { backgroundColor: "white" }]}>
      <ScrollView
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        // }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          tailwind`flex bg-[${theme.colors.lightbrown1}] mx-auto  items-center w-full self-center`,
          {
            minHeight: SCREEN_HEIGHT,
          },
        ]}
      >
        <View
          style={[
            tailwind`w-full bg-[${theme.colors.lightbrown2}] flex-wrap flex-row p-2 flex flex-row items-center justify-around`,
            { paddingBottom: 100, minHeight: SCREEN_HEIGHT },
          ]}
        >
          {products.map((product, i) => {
            if (state.products.length == 0) return;
            return (
              <ProductCard
                product={product}
                key={i}
                width={0.45 * SCREEN_WIDTH}
                height={0.3 * SCREEN_HEIGHT}
              />
            );
          })}


          {!isEmpty(products) && (
            <Text
              style={[
                tailwind`w-full bg-[${theme.colors.lightbrown2}] flex-wrap flex-row p-2 flex flex-row items-center justify-around text-xl pt-8`,
                { paddingBottom: 100, minHeight: SCREEN_HEIGHT },
              ]}
            >
              Product Total: ${getTotalProductPrice(products)}
            </Text>
          )}




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
