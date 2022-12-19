import React, { useEffect, useRef, useState, memo } from "react";
import { Image, View, ActivityIndicator } from "react-native";
import * as FileSystem from "expo-file-system";

function getImgXtension(uri) {
  if (!uri) return
  console.log("uri received is ", uri)
  var basename = uri.split(/[\\/]/).pop();
  return /[.]/.exec(basename) ? /[^.]+$/.exec(basename) : undefined;
}
async function findImageInCache(uri) {
  try {
    let info = await FileSystem.getInfoAsync(uri);
    return { ...info, err: false };
  } catch (error) {
    return {
      exists: false,
      err: true,
      msg: error,
    };
  }
}
async function cacheImage(uri, cacheUri, callback) {
  try {
    const downloadImage = FileSystem.createDownloadResumable(
      uri,
      cacheUri,
      {},
      callback
    );
    const downloaded = await downloadImage.downloadAsync();
    return {
      cached: true,
      err: false,
      path: downloaded.uri,
    };
  } catch (error) {
    return {
      cached: false,
      err: true,
      msg: error,
    };
  }
}
const CustomFastImage = (props) => {
  const {
    source: { uri },
    cacheKey,
    style,
  } = props;
  const isMounted = useRef(true);
  const [imgUri, setUri] = useState("");
  useEffect(() => {
    async function loadImg() {
      let imgXt = getImgXtension(uri);
      console.log("imgXt is ", imgXt);
      if (!imgXt || !imgXt.length) {
        //Alert.alert(`Couldn't load Image!`);
        console.log("Couldn't load Image!`");
        return;
      }
      const cacheFileUri = `${FileSystem.cacheDirectory}${cacheKey}.${imgXt[0]}`;
      let imgXistsInCache = await findImageInCache(cacheFileUri);
      if (imgXistsInCache.exists) {
        console.log("already cached!");
        setUri(cacheFileUri);
      } else {
        let cached = await cacheImage(uri, cacheFileUri, () => {});
        if (cached.cached) {
         // console.log("cached NEw!");
          setUri(cached.path);
        } else {
          console.log("Couldn't load Image!`");
          //Alert.alert(`Couldn't load Image!`);
        }
      }
    }
    loadImg();
    return () => (isMounted.current = false);
  }, []);
  return (
    <>
      {imgUri ? (
        <Image source={{ uri: imgUri }} style={[...style]} resizeMode="cover" />
      ) : (
        <View
          style={{ ...style, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size={33} />
        </View>
      )}
    </>
  );
};
function arePropsEqual(prevProps, nextProps) {
  if (
    prevProps.source === nextProps.source &&
    prevProps.cacheKey === nextProps.cacheKey
  ) {
    return false;
  }

  return true;
}
export default memo(CustomFastImage, arePropsEqual);
