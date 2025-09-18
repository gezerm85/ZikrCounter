import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { fixedColors } from '../../utils/Theme/VectorTheme';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

// Import screens
import HomeScreen from '../../pages/HomeScreen/HomeScreen';
import FavoriteScreen from '../../pages/FavoriteScreen/FavoriteScreen';
import PrayerTimes from '../../pages/PrayerTimes/PrayerTimes';
import SettingsScreen from '../../pages/SettingsScreen/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            return <Ionicons name={focused ? 'heart' : 'heart-outline'} size={size} color={color} />;
          } else if (route.name === 'PrayerTimes') {
            return <MaterialIcons name={focused ? 'schedule' : 'schedule'} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <MaterialIcons name={focused ? 'settings' : 'settings'} size={size} color={color} />;
          }
          return <MaterialIcons name="help" size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
        tabBarStyle: {
          backgroundColor: fixedColors.header,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'OpenSans',
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,

      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: t("TITLE"),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoriteScreen}
        options={{
          title: t("FAVORITES"),
           
        }}
      />
      <Tab.Screen
        name="PrayerTimes"
        component={PrayerTimes}
        options={{
          title: t("PRAYER_TIMES"),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: t("SETTINGS"),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
