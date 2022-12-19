import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import tailwind from "twrnc";
import { useNavigation } from "@react-navigation/native";
import CustomFastImage from "../../utilities/CustomFastImage";
import getCacheKey from "../../utilities/CustomFastImage/retreiveCacheKey";
import { SCREEN_WIDTH } from "../../utilities/constants";
export default function ImageHolder({ product, width, height }: any) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={[tailwind`bg-[#ddd] my-2 rounded-xl`,{ width: width || SCREEN_WIDTH*0.96, height: height || '100%'}]}
      //onPress={() => navigation.navigate("ProductScreen",product )}
    >
      <CustomFastImage
        style={[tailwind`bg-[#d3d456] w-full items-center rounded-t-xl`, { borderWidth: 2, height:400  }]}
        cacheKey={getCacheKey(product?.image)}
        source={{
          uri: product?.image,
        }}
      /> 
    </TouchableOpacity>
  );
}
