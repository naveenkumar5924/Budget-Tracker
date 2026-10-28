import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem} from '@react-navigation/drawer';
import {Ionicons} from '@expo/vector-icons';
import {AppProvider,useApp} from './src/store';
import {C} from './src/ui';
import * as S from './src/screens';

const Stack=createNativeStackNavigator(),Tab=createBottomTabNavigator(),Drawer=createDrawerNavigator();
const tabIcon=n=>({tabBarIcon:({color,size})=><Ionicons name={n} size={size} color={color}/>});

function Tabs(){const {user}=useApp();
 return <Tab.Navigator screenOptions={{headerShown:false,tabBarActiveTintColor:C.p}}>
  {user.role==='customer'?<>
   <Tab.Screen name="Reports" component={S.Reports} options={tabIcon('home')}/>
   <Tab.Screen name="Transactions" component={S.Transactions} options={tabIcon('swap-vertical')}/>
   <Tab.Screen name="Categories" component={S.Categories} options={tabIcon('grid')}/>
   <Tab.Screen name="Analysis" component={S.Analysis} options={tabIcon('stats-chart')}/></>:<>
   <Tab.Screen name="Analysis" component={S.Analysis} options={tabIcon('stats-chart')}/>
   <Tab.Screen name="Users" component={S.Users} options={tabIcon('people')}/></>}
 </Tab.Navigator>}

function Menu(p){const {signOut,user}=useApp();
 return <DrawerContentScrollView {...p}><DrawerItemList {...p}/>
  <DrawerItem label={`Logout (${user.name})`} icon={({color,size})=><Ionicons name="log-out" size={size} color={color}/>} onPress={signOut}/></DrawerContentScrollView>}

function Main(){const {user}=useApp();
 return <Drawer.Navigator drawerContent={Menu} screenOptions={{headerStyle:{backgroundColor:C.d},headerTintColor:'#fff',drawerActiveTintColor:C.p}}>
  <Drawer.Screen name="Dashboard" component={Tabs}/>
  {user.role==='customer'&&<Drawer.Screen name="Profile" component={S.Profile}/>}
 </Drawer.Navigator>}

function Root(){const {user}=useApp();
 return <Stack.Navigator screenOptions={{headerStyle:{backgroundColor:C.d},headerTintColor:'#fff'}}>
  {user?<>
   <Stack.Screen name="Main" component={Main} options={{headerShown:false}}/>
   <Stack.Screen name="CategoryDetails" component={S.CategoryDetails} options={{title:'Category Details'}}/>
   <Stack.Screen name="EditProfile" component={S.EditProfile} options={{title:'Edit Profile'}}/></>:<>
   <Stack.Screen name="Home" component={S.Home} options={{headerShown:false}}/>
   <Stack.Screen name="Auth" component={S.Auth} options={{title:'Account'}}/></>}
 </Stack.Navigator>}

export default function App(){
 return <AppProvider><NavigationContainer><Root/></NavigationContainer></AppProvider>}