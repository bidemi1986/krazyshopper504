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
// import {
// 	getAllMyDetails,
// 	updateMyProfile,
// 	initiateChat,
// 	getUserDetails,
// 	uploadProfileWithNewProfilePhoto,
// } from '../../Utilities/firebase';
// import {
// 	editOneProduct,
// 	deleteProduct,
// 	unpublishProduct,
// } from '../../Utilities/firebaseProducts';
import C504Default from "./AuthScreens/style";
import { Context } from "../context";
import { LinearGradient } from "expo-linear-gradient";
import ProductCard from "../components/ShopComps/ProductCard";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { EvilIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { CATEGORIES } from "../EbiMall/Categories";
import CustomFastImage from "../utilities/CustomFastImage";
import getCacheKey from "../Utilities/CustomFastImage/retreiveCacheKey";
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SCREEN_WIDTH = Dimensions.get("window").width;

export default function Profile({ route, navigation }) {
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
  const [products, setProducts] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  //STATE FOR PRODUCT EDIT
  const [productData, setProductData] = useState();
  const [imgObj, setImgObj] = useState("");
  const [selectedProductImage, setSelectedProductImage] = useState("");
  const [openProduct, setOpenProduct] = useState(false);
  const [pvisible, setPVisible] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setSelectedCategory] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const ptoggleOverlay = () => {
    setOpenProduct(!openProduct);
    setPVisible(!pvisible);
  };
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
    let res = await getAllMyDetails(route.params.userID);
    if (res.msg === "SUCCESS") {
      console.log("profile data recieved is ", res);
      if (route.params.userID == global.userID) {
        await SecureSave("FULL_BIO_DATA", JSON.stringify(res.data));
      }
      setBio(res.data.BIO);
      setPosts(res.data.POSTS.reverse());
      setProducts(res.data.PRODUCTS);
    } else {
      Alert.alert(
        "can't fetch your data at this time... pls check your connection"
      );
    }
  };
  const getMyLocalData = async () => {
    if (route.params.userID == global.userID) {
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
    } else {
      fetchMyData();
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

  const _pickProductImage = async () => {
    await getPermissionAsync();
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.65,
      });
      if (!result.cancelled) {
        setImgObj(result);
      }
    } catch (E) {
      Alert.alert("Something went wrong...");
      console.log(E);
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
        const response = await fetch(result.uri);
        const blob = await response.blob();
        setImageUploading(true);
        let { url, image } = await uploadProfileWithNewProfilePhoto(
          blob,
          result
        );
        setImgUrl(url);
        setImageUploading(false);
        onRefresh();
      }
    } catch (E) {
      Alert.alert("Something went wrong...");
      setImageUploading(false);
      console.log(E);
    }
  };
  useEffect(() => {
    //console.log("route.params ", route.params)
    getMyLocalData();
    return function cleanup() {
      setBio(null);
      setProducts(null);
    };
  }, []);

  return (
    <View style={{ ...styles.container, paddingTop: 0 }}>
      <LinearGradient
        colors={["#D0436D", "#D34C63", "#EFA00B"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={{ paddingTop: Constants.statusBarHeight }}
      >
        {/*  <AppMenu navigation={navigation} /> */}
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
            paddingBottom: 200,
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
                onPress={_pickImage}
                style={{ position: "relative" }}
                disabled={
                  (route.params.userID == global.userID ? false : true) ||
                  imageUploading
                }
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
                  {posts?.length || 0}
                </Text>
                <Text style={{ color: "#868686", fontSize: 16 }}>Posts</Text>
              </View>
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
                //style={C504Default.ProductCard.bigtitleapplications}
                multiline={true}
              >
                {bio?.firstName} {bio?.lastName || "..."}
              </Text>
            </View>
            <View
              style={{
                width: SCREEN_WIDTH * 0.86,
                flexDirection: "column",
                flexWrap: "wrap",
                minHeight: 60,
                marginLeft: 10,
              }}
            >
              <Text style={{ fontWeight: "700" }} multiline={true}>
                Bio {"\n"}
              </Text>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.88,
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                <Text
                  style={{ color: "#4D4D4D", fontSize: 14 }}
                  multiline={true}
                  numberOfLines={20}
                >
                  {bio?.description || "..."}
                </Text>
              </View>
            </View> 

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                width: "100%",
                marginBottom: 100,
              }}
            >
              {Array.isArray(posts) &&
                posts.length > 0 &&
                posts.map((post, id) => {
                  return (
                    <TouchableOpacity
                      // onPress={() => {
                      //   navigation.navigate("MainNavigator", {
                      //     screen: "FullPost",
                      //     params: {
                      //       post: post,
                      //     },
                      //   });
                      // }}
                      key={post.id}
                      style={{
                        width: "30%",
                        height: 122,
                        marginLeft: "3%",
                        marginTop: posts.indexOf(post) > 2 ? -10 : 0,
                      }}
                    >
                      {post?.featureImage ? (
                        <CustomFastImage
                          style={{
                            width: "100%",
                            height: 100,
                            borderRadius: 10,
                          }}
                          source={{
                            uri: post?.featureImage,
                          }}
                          cacheKey={getCacheKey(post?.featureImage)}
                        />
                      ) : (
                        <View
                          style={{
                            width: "100%",
                            height: 100,
                            borderRadius: 10,
                            backgroundColor: "#D0436D",
                            alignItems: "center",
                            justifyContent: "center",
                            paddingHorizontal: 20,
                          }}
                        >
                          <Text
                            numberOfLines={3}
                            style={{
                              color: "white",
                              fontSize: 20,
                              textAlign: "left",
                            }}
                          >
                            {post?.text || "..."}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
            </View>
          </View>
          {/* ////////////////////// Edit Profile Overlay  ///////////////////////// */}
          {/* ////////////////////// Edit Profile Overlay  ///////////////////////// */}
          {/* ////////////////////// Edit Profile Overlay  ///////////////////////// */}
          <Overlay
            isVisible={visible}
            onBackdropPress={toggleOverlay}
            overlayStyle={{ borderRadius: 20, paddingBottom: 20 }}
          >
            <Text
              style={{
                textAlign: "left",
                color: "rgb(211,76,99)",
                fontWeight: "bold",
                fontSize: 16,
                paddingVertical: 10,
                paddingBottom: 20,
              }}
            >
              EDIT PROFILE
            </Text>
            <View style={{ justifyContent: "flex-start" }}>
              <View
                style={{
                  width: SCREEN_WIDTH * 0.8,
                  alignSelf: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ ...styles.boxLabel, textAlign: "left" }}>
                  First Name
                </Text>
                <TextInput
                  value={bio?.firstName}
                  onChangeText={(val) => {
                    setBio((prev) => {
                      return { ...prev, firstName: val };
                    });
                  }}
                  style={[styles.inputStyle]}
                  placeholder="First Name"
                  keyboardType="default"
                />
                <Text style={{ ...styles.boxLabel, textAlign: "left" }}>
                  Last Name
                </Text>
                <TextInput
                  value={bio?.lastName}
                  onChangeText={(val) => {
                    setBio((prev) => {
                      return { ...prev, lastName: val };
                    });
                  }}
                  style={[styles.inputStyle]}
                  placeholder="Last Name"
                  keyboardType="default"
                />
                <Text style={{ ...styles.boxLabel }}>About Me</Text>
                <TextInput
                  value={bio?.description}
                  onChangeText={(val) => {
                    setBio((prev) => {
                      return {
                        ...prev,
                        description: val,
                      };
                    });
                  }}
                  style={{ ...styles.inputStyle, minHeight: 70 }}
                  placeholder="Write something about yourself ..."
                  keyboardType="default"
                  multiline={true}
                />
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                ></View>

                <TouchableOpacity
                  onPress={async () => {
                    setIndicator(true);
                    if (!bio?.firstName || !bio?.lastName) {
                      Alert.alert(
                        "First name and last name cannot be empty..."
                      );
                      setIndicator(false);
                      return;
                    }
                    let res = await updateMyProfile(bio);
                    //console.log("res is ", res);
                    /*
                     */
                    if (res.msg == "SUCCESS") {
                      setIndicator(false);
                      setTimeout(function () {
                        Alert.alert("Successfully updated file!");
                        toggleOverlay();
                      }, 1000);
                    } else {
                      setIndicator(false);
                      toggleOverlay();
                      Alert.alert(`error! ${res?.err || "..."}`);
                    }
                  }}
                  style={{
                    ...C504Default.shadowProp,
                    alignSelf: "center",
                  }}
                >
                  <LinearGradient
                    colors={["#D0436D", "#D34C63", "#EFA00B"]}
                    style={{ ...styles.submitButton }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {indicator === true ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Update Profile</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <KeyboardSpacer topSpacing={-150} />
            </View>
            {showExtraKeyboardSpacer && (
              <KeyboardSpacer topSpacing={SCREEN_HEIGHT < 700 ? -0 : -200} />
            )}
          </Overlay>

          {/* ////////////////////// Edit Product Overlay  ///////////////////////// */}
          {/* ////////////////////// Edit Product Overlay  ///////////////////////// */}
          {/* ////////////////////// Edit Product Overlay  ///////////////////////// */}

          <Overlay isVisible={pvisible} onBackdropPress={ptoggleOverlay}>
            <Text
              style={{
                textAlign: "left",
                color: "rgb(211,76,99)",
                fontWeight: "bold",
                fontSize: 16,
                paddingVertical: 20,
                paddingTop: 0,
              }}
            >
              Edit Product
            </Text>
            <View style={{ justifyContent: "flex-start" }}>
              <TouchableOpacity
                style={{ width: "100%", borderRadius: 20 }}
                disabled={indicator}
                onPress={() => {
                  _pickProductImage();
                }}
              >
                {!imgObj ? (
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
                        uri: imgObj?.uri || "",
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
                    let editedProduct = {
                      ...productData,
                      name,
                      description,
                      price,
                      category,
                      productImage: productData?.productImage,
                      type,
                      location,
                    };
                    // console.log("product passed ", product);
                    try {
                      let res = await editOneProduct(editedProduct, imgObj);
                      if (res.msg == "SUCCESS") {
                        setIndicator(false);
                        setTimeout(function () {
                          Alert.alert("Success!");
                          ptoggleOverlay();
                          setProductData(null);
                          onRefresh();
                        }, 1000);
                      } else {
                        setIndicator(false);
                        ptoggleOverlay();
                        Alert.alert(`error! ${res?.err || "..."}`);
                      }
                    } catch (err) {
                      setIndicator(false);
                      Alert.alert("something went wrong, try again later...");
                    }
                  }}
                  style={{
                    ...C504Default.shadowProp,
                    alignSelf: "center",
                    marginBottom: 20,
                  }}
                >
                  <LinearGradient
                    colors={["#D0436D", "#D34C63", "#EFA00B"]}
                    style={{ ...styles.submitButton }}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {indicator === true ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Submit</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <KeyboardSpacer topSpacing={-150} />
            </View>
            {Platform.OS === "ios" && showExtraKeyboardSpacer && (
              <KeyboardSpacer topSpacing={SCREEN_HEIGHT < 700 ? -0 : -200} />
            )}
          </Overlay>
          <View style={{ height: 500 }}></View>
        </ScrollView>
        <View style={{ height: 200 }}></View>
      </LinearGradient>
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
