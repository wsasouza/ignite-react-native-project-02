import React from 'react';
import { Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Dashboard } from '../screens/Dashboard';
import { Register } from '../screens/Register';
import { Resume } from '../screens/Resume';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes(){
  const theme = useTheme();

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,        
        tabBarActiveTintColor: theme.colors.secondary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarLabelPosition: 'beside-icon',
        tabBarStyle: {
          height: 72,
          paddingVertical: Platform.OS === 'ios' ? 20 : 0,
          
        },
        tabBarLabelStyle: {
          fontFamily: theme.fonts.medium,
          fontSize: 14          
        }
      }}
    >
      <Screen 
        name="Listagem"
        component={Dashboard} 
        options={{
          tabBarIcon: (({ size, color }) => 
            <Feather 
              name="list"
              size={size}
              color={color}
            />
          )
        }}     
      />
       <Screen 
        name="Cadastrar"
        component={Register}         
        options={{          
          tabBarIcon: (({ size, color }) => 
            <Feather
              name="edit"
              size={size}
              color={color}
            />
          )
        }}          
      />
       <Screen 
        name="Resumo"
        component={Resume} 
        options={{
          tabBarIcon: (({ size, color }) => 
            <Feather 
              name="pie-chart"
              size={size}
              color={color}
            />
          )
        }}          
      />
      
    </Navigator>
  )
}