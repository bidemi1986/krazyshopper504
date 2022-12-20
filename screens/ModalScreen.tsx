import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SecureSave, SecureGet } from "../utilities/helpers";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {
  LinearProgress,
  Image as Image2,
  Overlay,
  SpeedDial,
} from "@rneui/themed";
import { createProduct, fetch_all_products } from "../functions/product-api/product-functions";
import { getAllMyDetails } from "../functions/user-api/user-funcs";
import C504Default from "./AuthScreens/style";
import { Context } from "../context"; 
import ProductCard from "../components/ShopComps/ProductCard"; 
import { FontAwesome, Ionicons, EvilIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { CATEGORIES } from "../utilities/Categories";
import CustomFastImage from "../utilities/CustomFastImage";
import getCacheKey from "../utilities/CustomFastImage/retreiveCacheKey";
import tailwind from "twrnc";
import { theme } from "../theme/core/theme";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ModalScreen({ route, navigation }) {
  const { state, dispatch } = useContext(Context);
  const [tabOption, setTabOption] = useState("Posts");
  const [indicator, setIndicator] = useState(false);
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [bio, setBio] = useState();
  const [showExtraKeyboardSpacer, setShowExtraKeyboardSpacer] = useState(false);
  const [products, setProducts] = useState([1, 2, 3, 4]);
  //STATE FOR PRODUCT EDIT
  const [productData, setProductData] = useState();
  const [imgObj, setImgObj] = useState("");
  const [selectedProductImage, setSelectedProductImage] = useState("");
  const [openProduct, setOpenProduct] = useState(false);
  const [pvisible, setPVisible] = useState(false);
	const [productImage, setProductImage] = useState('');
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amount,  setAmount] = useState(0);
  const [price, setPrice] = useState(0);
  const [category, setSelectedCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false); 
  const ptoggleOverlay = () => {
    setOpenProduct(!openProduct);
    setPVisible(!pvisible);
  };
  let product = {
    name, description, price, amount, category, productImage
  }
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    fetchMyData();
    setTimeout(function () {
      setRefreshing(false);
    }, 1000);
  }, []);
  const toggleOverlay = () => {
    setOpen(!open);
    setVisible(!visible);
  };
  const fetchMyData = async () => {
    let res = await getAllMyDetails(global.userID);
    if (res.msg === "SUCCESS") {
      console.log("profile data recieved is ", res);
      await SecureSave("FULL_BIO_DATA", JSON.stringify(res.data));
      setBio(res.data.BIO); 
      setProducts(res.data.PRODUCTS);
    } else {
      Alert.alert(
        "can't fetch your data at this time... pls check your connection"
      );
    }
  };
  const showOptionsAlert = () => {
    //function to make two option alert
    Alert.alert(
      //This is title
      "Edit Profile",
      //This is body text
      "What do you want to do?",
      [
        {
          text: "Edit",
          onPress: () => {
            setOpen(!open);
            toggleOverlay();
          },
        },
        {
          text: "Cancel",
          onPress: () => console.log("No Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
      //on clicking out side, Alert will not dismiss
    );
  };

  const getMyLocalData = async () => {
    let myBIODATA = await SecureGet("FULL_BIO_DATA");
    if (myBIODATA === undefined) {
      onRefresh();
    } else if (myBIODATA !== undefined) {
      let p2 = await JSON.parse(myBIODATA);
      setBio(p2.BIO);
      setProducts(p2.PRODUCTS);
      //onRefresh()
    } else {
      onRefresh();
    }
  };
  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const _pickImage = async () => {
		await getPermissionAsync();
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.65,
			});
			if (!result.cancelled) {
				setProductImage(result);
			}
		} catch (E) {
			Alert.alert('Something went wrong...');
			console.log(E);
		}
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
    //console.log("route.params ", route.params)
    getMyLocalData();
    fetchMyData();
    return function cleanup() {
      setBio(null);
      setProducts(null);
    };
  }, []);

  return (
    <View style={[tailwind`w-full flex `, { backgroundColor: "white" }]}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        style={{
          width: SCREEN_WIDTH,
          backgroundColor: "#F8F5F6",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingTop: 20,
          paddingBottom: 400, 
        }}
      >
        <View
          style={{
            width: SCREEN_WIDTH * 0.9,
            alignSelf: "center",
            flexDirection: "row",
            flexWrap: "wrap",
            //justifyContent: "space-around",
          }}
        >
          <View
            style={{
              paddingHorizontal: 0,
              flexDirection: "row",
              justifyContent: "flex-start",
              position: "relative",
              width: "100%",
              marginBottom: 0,
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={()=>{
                //_pickImage 
                return
              }}
              style={{ position: "relative" }}
              disabled={imageUploading}
            >
              {!bio?.photoURL ? (
                <Image2
                  source={{
                    uri: "https://firebasestorage.googleapis.com/v0/b/ebimarketplace-bb986.appspot.com/o/user.png?alt=media&token=0e266e4c-48fb-455e-8606-b5e511cd53c9",
                  }}
                  style={C504Default.PostCard.followAuthorImage}
                  PlaceholderContent={<ActivityIndicator />}
                />
              ) : (
                <CustomFastImage
                  style={C504Default.PostCard.followAuthorImage}
                  source={{
                    uri: bio?.photoURL,
                  }}
                  cacheKey={getCacheKey(bio?.photoURL)}
                />
              )}
              {imageUploading && (
                <ActivityIndicator
                  size="large"
                  color="white"
                  style={{
                    opacity: 1,
                    position: "absolute",
                    top: 20,
                    left: 20,
                  }}
                  animating={true}
                />
              )}
            </TouchableOpacity>
            <View
              style={{
                marginLeft: 10,
                borderRadius: 14,
                paddingHorizontal: 11,
                justifyContent: "center",
              }}
            >
              <Text
                style={{ color: "#868686", fontSize: 16, fontWeight: "bold" }}
              >
                {products?.length || 0}
              </Text>
              <Text style={{ color: "#868686", fontSize: 13 }}>Products</Text>
            </View> 
              <TouchableOpacity
                style={[
                  tailwind`bg-[${theme.colors.lightbrown1}] w-[50%] p-3 rounded-md`,
                ]}
                onPress={()=>setPVisible(true)}
              >
                <Text style={[tailwind`text-white text-center`]}>
                  Upload Product
                </Text>
              </TouchableOpacity> 
          </View>
          <View
            style={{
              width: SCREEN_WIDTH,
              paddingVertical: 10,
              paddingTop: 0,
              marginLeft: -10,
              //width:"100%"
            }}
          >
            <Text
              style={C504Default.ProductCard.bigtitleapplications}
              multiline={true}
            >
              {bio?.firstName} {bio?.lastName || "Biddy Akinade"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            {Array.isArray(products) &&
              products.length > 0 &&
              products.map((item, i) => {
                return (
                  <View style={{ position: "relative" }} key={item?.id}>
                    <ProductCard 
                      key={item?.id} 
                      product={item}
                      width={0.4 * SCREEN_WIDTH}
                      height={0.3 * SCREEN_HEIGHT}
                    />
                  </View>
                );
              })}
          </View>
          {/* ////////////////////// Create Product Overlay  ///////////////////////// */}
          {/* ////////////////////// Create Product Overlay  ///////////////////////// */}
          {/* ////////////////////// Create Product Overlay  ///////////////////////// */}

          <Overlay isVisible={pvisible} onBackdropPress={ptoggleOverlay}>
            <Text
              style={{
                textAlign: "left",
                color: theme.colors.lightbrown1,
                fontWeight: "bold",
                fontSize: 16,
                paddingVertical: 20,
                paddingTop: 0,
              }}
            >
              Create Product
            </Text>
            <View style={{ justifyContent: "flex-start" }}>
              <TouchableOpacity
                style={{ width: "100%", borderRadius: 20 }}
                disabled={indicator}
                onPress={() => {
                  _pickImage();
                }}
              >
                {!productImage ? (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#D3D3D3",
                        width: "100%",
                        justifyContent: "flex-start",
                        padding: 10,
                        borderRadius: 5,
                        alignItems: "center",
                        marginTop: -10,
                      }}
                    >
                      <EvilIcons name="camera" size={40} color="black" />
                      <Text style={{ color: "grey" }}>Add product image</Text>
                    </View>
                    {indicator && (
                      <LinearProgress
                        color="#EFA00B"
                        style={{ backgroundColor: "#D34C63" }}
                      />
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      width: "100%",
                      height: 200,
                      borderRadius: indicator ? 0 : 10,
                    }}
                  >
                    <Image
                      source={{
                        uri: productImage?.uri || "",
                      }}
                      style={{
                        width: "100%",
                        height: 200,
                        borderRadius: indicator ? 0 : 10,
                      }}
                      PlaceholderContent={<ActivityIndicator />}
                    />
                    {indicator && (
                      <LinearProgress
                        color="#EFA00B"
                        style={{ backgroundColor: "#D34C63" }}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>

              <View
                style={{
                  width: SCREEN_WIDTH * 0.8,
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                <Text style={{ ...styles.boxLabel, textAlign: "left" }}>
                  Product Name
                </Text>
                <TextInput
                  value={name}
                  onChangeText={(val) => setName(val)}
                  style={[styles.inputStyle]}
                  placeholder="Product Name"
                  keyboardType="default"
                  editable={!indicator}
                />

                <Text style={{ ...styles.boxLabel }}>Product Description</Text>
                <TextInput
                  value={description}
                  onChangeText={(val) => setDescription(val)}
                  style={{ ...styles.inputStyle, minHeight: 70 }}
                  placeholder="Describe the product"
                  keyboardType="default"
                  multiline={true}
                  editable={!indicator}
                />
                <Text style={{ ...styles.boxLabel }}>Amount in stock</Text>
                <TextInput
                  value={amount}
                  onChangeText={(val) => setAmount(val)}
                  style={{ ...styles.inputStyle, minHeight: 30 }}
                  placeholder="Stock amount"
                  keyboardType='numeric'
                  editable={!indicator}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "96%",
                    alignSelf: "center",
                  }}
                >
                  <View
                    style={{
                      overflow: "hidden",
                      width: "60%",
                      paddingRight: 10,
                    }}
                  >
                    <Text style={{ ...styles.boxLabel }}>Category</Text>
                    <View style={styles.dropdown}>
                      <RNPickerSelect
                        style={pickerSelectStyles.inputIOS}
                        value={category}
                        onValueChange={(value) => {
                          setSelectedCategory(value);
                        }}
                        items={[...CATEGORIES]}
                        disabled={indicator}
                      />
                    </View>
                  </View>

                  <View style={{ flexDirection: "column", width: "40%" }}>
                    <Text style={{ ...styles.boxLabel }}>Price</Text>
                    <TextInput
                      onFocus={() => {
                        setShowExtraKeyboardSpacer(true);
                      }}
                      onBlur={() => {
                        setShowExtraKeyboardSpacer(false);
                      }}
                      value={price}
                      style={[
                        styles.inputStyle,
                        styles.shadowProp,
                        { width: "100%" },
                      ]}
                      onChangeText={(val) => setPrice(val)}
                      placeholder="Price"
                      keyboardType="numeric"
                      editable={!indicator}
                    />
                  </View>
                </View>
                <TouchableOpacity
                  disabled={indicator}
                  onPress={async () => {
                    setIndicator(true); 
                    // console.log("product passed ", product);
                    try {
                      let res = await createProduct(product);
                      if (res.msg == "SUCCESS") {
                        setIndicator(false); 
                        setTimeout(function () {
                          Alert.alert("Success!");
                          fetchProducts();
                          ptoggleOverlay(); 
                         // onRefresh();
                        }, 1000);
                      } else {
                        setIndicator(false);
                        ptoggleOverlay();
                        Alert.alert(`error! ${res?.err || "..."}`);
                      }
                    } catch (err) {
                      setIndicator(false);
                      Alert.alert("something went wrong, try again later...", err);
                    }
                  }}
                  style={[
                    tailwind`bg-[${theme.colors.lightbrown1}] w-full p-3 rounded-md my-3 mb-6`,
                  ]}
                > 
                    {indicator === true ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Submit</Text>
                    )} 
                </TouchableOpacity>
              </View>
              {/* <KeyboardSpacer topSpacing={-150} /> */}
            </View>
            {/* {Constants.Platform.OS === 'ios' && showExtraKeyboardSpacer && (
							<KeyboardSpacer topSpacing={SCREEN_HEIGHT < 700 ? -0 : -200} />
						)} */}
          </Overlay>
          <View style={{ height: 500, paddingVertical:500 }}></View>
        </View>
      </ScrollView>
      <View style={{ height: 300 }}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: C504Default.container,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
