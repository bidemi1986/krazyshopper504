const res = {
  msg: "SUCCESS",
  user: {
    disabled: false,
    email: "test01@gmail.com",
    emailVerified: false,
    metadata: {
      creationTime: "Wed, 10 Jun 2020 15:28:06 GMT",
      lastSignInTime: null,
    },
    providerData: [
      {
        email: "test01@gmail.com",
        providerId: "password",
        uid: "test01@gmail.com",
      },
    ],
    tokensValidAfterTime: "Wed, 10 Jun 2020 15:28:06 GMT",
    uid: "KGAe1Vc0O6hB9wAnXe6tIyiWPL92",
  },
};

import React from "react";
import { Image, Text, View } from "react-native";
import { SplashScreen } from "expo";
import { Asset } from "expo-asset";

export default class App extends React.Component {
  state = {
    isReady: false,
  };

  componentDidMount() {
    SplashScreen.preventAutoHide();
  }

  render() {
    if (!this.state.isReady) {
      return (
        <View style={{ flex: 1 }}>
          <Image
            source={require("./assets/images/splash.gif")}
            onLoad={this._cacheResourcesAsync}
          />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <Image source={require("./assets/images/expo-icon.png")} />
        <Image source={require("./assets/images/slack-icon.png")} />
      </View>
    );
  }

  _cacheSplashResourcesAsync = async () => {
    const gif = require("./assets/images/splash.gif");
    return Asset.fromModule(gif).downloadAsync();
  };

  _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    const images = [
      require("./assets/images/expo-icon.png"),
      require("./assets/images/slack-icon.png"),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    this.setState({ isReady: true });
  };
}
