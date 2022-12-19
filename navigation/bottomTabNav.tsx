import { FontAwesome } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; 
import * as React from 'react';
import { ColorSchemeName, Pressable } from 'react-native';
import { Theme } from '@react-navigation/native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme'; 
import TabOneScreen from '../screens/ShopScreen';
import TabTwoScreen from '../screens/FavouriteScreen';
import { theme } from '../theme/core/theme';
import { RootTabParamList, RootTabScreenProps } from '../types'; 

const BottomTab = createBottomTabNavigator<RootTabParamList>();

export const BottomTabNavigator =()=> {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{
        tabBarActiveTintColor: "#ffe9d8",
        tabBarActiveBackgroundColor:  theme.colors.lightbrown1,   
        tabBarShowLabel: false,  
        tabBarStyle:{
          paddingVertical:0,
          height:100,
          marginBottom:0,
          backgroundColor:'#ffe9d8'
        }
      }}>
      <BottomTab.Screen
        name="TabOne"
        component={TabOneScreen} 
        options={({ navigation }: RootTabScreenProps<'TabOne'>) => ({
          title: 'Shop',
          tabBarIcon: ({ color }) => <TabBarIcon name="shopping-bag" color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Modal')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}>
              <FontAwesome
                name="info-circle"
                size={25}
                color={Colors[colorScheme].text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <BottomTab.Screen
        name="TabTwo"
        component={TabTwoScreen}
        options={{
          title: 'Favorites', 
          tabBarIcon: ({ color }) => <TabBarIcon name="heart" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
 function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
  }) {
    return <FontAwesome size={30} style={{ marginBottom: -3 }} {...props} />;
  }
  