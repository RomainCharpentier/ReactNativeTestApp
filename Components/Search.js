import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import FilmItem from './FilmItem';
import FilmList from './FilmList';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
        width: '100%'
    },
    textinput: {
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const Search = props => {

    let searchedText = '';
    let page = 0; // Compteur pour connaître la page courante
    let totalPages = 0; // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB

    const [films, setFilms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const _searchFilms = () => {
        page = 0;
        totalPages = 0;
        setFilms([]);
    }

    useEffect(
        () => _loadFilms, [films]
    );

    const _loadFilms = () => {
        if (searchedText.length > 0) {
            setIsLoading(true);
            getFilmsFromApiWithSearchedText(searchedText, page + 1).then(data => {
                page = data.page;
                totalPages = data.total_pages;
                setFilms([...films, ...data.results]);
                setIsLoading(false);
            });
        }
    }

    const _displayLoading = () => {
        if (isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    const _displayDetailForFilm = (idFilm) => {
        props.navigation.navigate("FilmDetail", { idFilm: idFilm });
    }

    const _searchTextInputChanged = (text) => {
        searchedText = text;
    }

    return (
        <SafeAreaView style={styles.main_container}>
            <View style={styles.main_container}>
                <TextInput
                    style={styles.textinput}
                    placeholder='Titre du film'
                    onChangeText={(text) => _searchTextInputChanged(text)}
                    onSubmitEditing={() => _searchFilms()}
                />
                <Button title='Rechercher' onPress={() => _searchFilms()}/>
                <FilmList
                    films={films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
                    navigation={props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                    loadFilms={_loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                    page={page}
                    totalPages={totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                    favoriteList={false}
                />
                {_displayLoading()}
            </View>
        </SafeAreaView>
    );
}

// On connecte le store Redux, ainsi que les films favoris du state de notre application, à notre component Search
const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}
  
export default connect(mapStateToProps)(Search);