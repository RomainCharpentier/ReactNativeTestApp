import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import FilmItem from './FilmItem';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    list: {
        flex: 1
    }
});

const FilmList = props => {

    const [films, setFilms] = useState([]);

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film " + idFilm)
        // On a récupéré les informations de la navigation, on peut afficher le détail du film
        props.navigation.navigate('FilmDetail', {idFilm: idFilm})
    }

    return (
        <FlatList
            style={styles.list}
            data={props.films}
            extraData={props.favoritesFilm}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({item}) => (
                <FilmItem
                    film={item}
                    isFilmFavorite={(props.favoritesFilm.findIndex(film => film.id === item.id) !== -1) ? true : false}
                    displayDetailForFilm={_displayDetailForFilm}
                />
            )}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
                if (!props.favoriteList && props.page < props.totalPages) {
                    props.loadFilms()
                }
            }}
        />
    )
}

const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(FilmList);