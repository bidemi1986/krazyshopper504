import { View, Text, TouchableOpacity, Alert } from "react-native";
import React,{useContext} from "react";
import tailwind from "twrnc";
import { Context } from "../../context";
import { useNavigation } from "@react-navigation/native";
import CustomFastImage from "../../utilities/CustomFastImage";
import getCacheKey from "../../utilities/CustomFastImage/retreiveCacheKey";
import { SCREEN_WIDTH } from "../../utilities/constants";
import { theme } from "../../theme/core/theme";
import { update_my_cart } from "../../functions/product-api/product-functions";
export default function ProductCard({ product, width, height }: any) {
  const { state, dispatch } = useContext(Context);
  const navigation = useNavigation();
  const updateCart = async () => {
    let res = await  update_my_cart(product.id);
    if (res.msg === "SUCCESS") {
      console.log("profile data recieved is ", res);  
      dispatch({
        type: "ADD_DB_USER_DATA",
        payload: res.data,
      });
    } else {
      Alert.alert(
        "can't update your cart at this time... "
      );
    }
  };
  return (
    <View
      style={[
        tailwind`bg-[#fff] my-2 rounded-xl`,
        { width: width || SCREEN_WIDTH * 0.96, minHeight: height || 250 },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.navigate("ProductScreen", product)}
      >
        <CustomFastImage
          style={[
            tailwind`bg-[${theme.colors.lightbrown1}] w-full items-center rounded-t-xl h-[44]`,
            { borderWidth: 2 },
          ]}
          cacheKey={getCacheKey(product?.image)}
          source={{
            uri: product?.image,
          }}
        />
      </TouchableOpacity>
      <View style={[tailwind`bg-[#fff]  p-4`]}>
        <Text style={[tailwind`text-lg overflow-hidden`]}  numberOfLines={1}>{product?.name || ""}</Text>
        <Text>{product?.price || ""}</Text>
      </View>
      <TouchableOpacity style={[tailwind`p-2 border-2 border-[${theme.colors.lightbrown1}]`]}
      onPress={()=>updateCart()}
      ><Text style={[tailwind`text-center`]}>{state.cart.includes(product.id)?"REMOVE":"ADD TO CART"}</Text></TouchableOpacity>
    </View>
  );
}
