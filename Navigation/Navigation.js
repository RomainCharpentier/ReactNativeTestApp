import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Search from '../Components/Search';
import FilmDetail from '../Components/FilmDetail';
import Favorites from '../Components/Favorites';
import Test from '../Components/Test';

const styles = StyleSheet.create({
    icon: {
        width: 30,
        height: 30
    }
});

const SearchStackNavigator = createStackNavigator({
    Search: {
        screen: Search,
        navigationOptions: {
            title: 'Rechercher'
        }
    },
    FilmDetail: {
        screen: FilmDetail
    }
})

const MoviesTabNavigator = createBottomTabNavigator({
    Test: {
        screen: Test
    },
    Search: {
        screen: SearchStackNavigator,
        navigationOptions: {
            tabBarIcon: () => { // On définit le rendu de nos icônes par les images récemment ajoutés au projet
                return <Image
                            source={require('../Images/ic_search.png')}
                            style={styles.icon}
                        /> // On applique un style pour les redimensionner comme il faut
            }
        }
    },
    Favorites: {
        screen: Favorites,
        navigationOptions: {
            tabBarIcon: () => {
                return <Image
                            source={require('../Images/ic_favorite.png')}
                            style={styles.icon}
                        />
            }
        }
    }
},
{
    tabBarOptions: {
        activeBackgroundColor: '#DDDDDD', // Couleur d'arrière-plan de l'onglet sélectionné
        inactiveBackgroundColor: '#FFFFFF', // Couleur d'arrière-plan des onglets non sélectionnés
        showLabel: false, // On masque les titres
        showIcon: true // On informe le TabNavigator qu'on souhaite afficher les icônes définis
    }
});

export default createAppContainer(MoviesTabNavigator)