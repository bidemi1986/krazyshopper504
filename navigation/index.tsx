import { useEffect, useState, useContext } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { BottomTabNavigator } from './bottomTabNav';
import { SecureGet } from '../utilities/helpers';
import { Context } from '../context';
import Auth from './auth'
import ModalScreen from '../screens/ModalScreen';
import NotFoundScreen from '../screens/NotFoundScreen'; 
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types'; 
import LinkingConfiguration from './LinkingConfiguration';
import ProductScreen from '../screens/ProductScreen';

export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { state, dispatch } = useContext(Context);
  // const [userID, setUserID] = useState();
  const [loading, setLoading] = useState(true);
  const isUserSignedIn = async () => {
    let r2 = await SecureGet("signInData");
    console.log("r2 is ", r2)
    if (r2) {
      let data  = JSON.parse(r2) 
      console.log("data retreived from signInData is ",data)
      dispatch({
        type: "USER_ID_AVAILABLE",
        payload: data.userID,
      }); 
      global.userID = data.userID; 
      global.email = data.email;
    }
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    setLoading(false);
  };
  useEffect(() => {
    //console.log("user and userID is ", state.user, "  ", state.userID, "userRecord is", userRecord);
    if (state.userID) {
      setLoading(false);
    }
  }, [state, loading]);

  useEffect(() => {
    isUserSignedIn();
  }, []);
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {!state.userID ? <Auth />: <RootNavigator />}
    </NavigationContainer>
  );
}

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Root" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen name="Modal" component={ModalScreen} options={{ title: 'My Shop' }}/>
      </Stack.Group>
      <Stack.Screen name="ProductScreen" component={ProductScreen} options={{ title: 'ProductScreen' }} />
    </Stack.Navigator>
  );
}

 