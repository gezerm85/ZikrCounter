import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useExploreTheme } from '../../utils/Theme/ExploreTheme';

// Import screens
import HomeScreen from '../../pages/HomeScreen/HomeScreen';
import FavoriteScreen from '../../pages/FavoriteScreen/FavoriteScreen';
import PrayerTimes from '../../pages/PrayerTimes/PrayerTimes';
import SettingsScreen from '../../pages/SettingsScreen/SettingsScreen';
import ExploreScreen from '../../pages/Explore/ExploreScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  const { t } = useTranslation();
  const { c, fonts } = useExploreTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <MaterialIcons name={focused ? 'radio-button-checked' : 'radio-button-unchecked'} size={size} color={color} />;
          } else if (route.name === 'Favorites') {
            return <Ionicons name={focused ? 'bookmarks' : 'bookmarks-outline'} size={size} color={color} />;
          } else if (route.name === 'Explore') {
            return <Ionicons name={focused ? 'book' : 'book-outline'} size={size} color={color} />;
          } else if (route.name === 'PrayerTimes') {
            return <MaterialIcons name={focused ? 'schedule' : 'schedule'} size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <Ionicons name={focused ? 'settings' : 'settings-outline'} size={size} color={color} />;
          }
          return <MaterialIcons name="help" size={size} color={color} />;
        },
        tabBarActiveTintColor: c.gold,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: {
          backgroundColor: c.tabbar,
          borderTopWidth: 1,
          borderTopColor: c.line,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: fonts.ui,
          fontWeight: '600',
          marginTop: 4,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t("TITLE") }} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} options={{ title: t("FAVORITES") }} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{ title: t("EXPLORE") }} />
      <Tab.Screen name="PrayerTimes" component={PrayerTimes} options={{ title: t("PRAYER_TIMES") }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t("SETTINGS") }} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
