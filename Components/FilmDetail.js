import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity, Share } from 'react-native';
import { getFilmDetailFromApi, getImageFromApi } from '../API/TMDBApi';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
    main_container: {
        flex: 1
    },
    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    scrollview_container: {
        flex: 1
    },
    image: {
        height: 169,
        margin: 5
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 35,
        flex: 1,
        flexWrap: 'wrap',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        marginBottom: 10,
        color: '#000000',
        textAlign: 'center'
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666',
        margin: 5,
        marginBottom: 15
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
    },
    favorite_container: {
        alignItems: 'center',
    },
    favorite_image:{
        flex: 1,
        width: null,
        height: null
    },
    share_touchable_floatingactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 30,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: '#e91e63',
        justifyContent: 'center',
        alignItems: 'center'
    },
    share_image: {
        width: 30,
        height: 30
    },
    share_touchable_headerrightbutton: {
        marginRight: 8
    }
});

const FilmDetail = props => {

    const isCancelled = useRef(false);
    const [film, setFilm] = useState(undefined);
    const [isLoading, setIsLoading] = useState(true);

    const navigationOptions = ({ navigation }) => {
        const { params } = navigation.state
        // On accède à la fonction shareFilm et au film via les paramètres qu'on a ajouté à la navigation
        if (params.film != undefined && Platform.OS === 'ios') {
            return {
                // On a besoin d'afficher une image, il faut donc passe par une Touchable une fois de plus
                headerRight: <TouchableOpacity
                                style={styles.share_touchable_headerrightbutton}
                                onPress={() => params.shareFilm()}>
                                <Image
                                    style={styles.share_image}
                                    source={require('../Images/ic_share.png')} />
                                </TouchableOpacity>
            }
        }
    }
  
    const _updateNavigationParams = () => {
        props.navigation.setParams({
            shareFilm: _shareFilm,
            film: film
        })
    }

    const _displayFloatingActionButton = () => {
        if (film != undefined && Platform.OS === 'android') { // Uniquement sur Android et lorsque le film est chargé
            return (
                <TouchableOpacity
                    style={styles.share_touchable_floatingactionbutton}
                    onPress={() => _shareFilm()}>
                    <Image
                        style={styles.share_image}
                        source={require('../Images/ic_share.png')} />
                </TouchableOpacity>
            );
        }
    }

    const _toggleFavorite = () => {
        const action = { type: "TOGGLE_FAVORITE", value: film }
        props.dispatch(action);
    }

    const _shareFilm = () => {
        Share.share({ title: film.title, message: film.overview });
    }

    const _displayFavoriteImage = () => {
        var sourceImage = require('../Images/ic_favorite_border.png');
        if (props.favoritesFilm.findIndex(item => item.id === film.id) !== -1) {
            // Film dans nos favoris
            sourceImage = require('../Images/ic_favorite.png');
        }
        return (
            <Image
                style={styles.favorite_image}
                source={sourceImage}
            />
        )
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

    const _displayFilm = () => {
        if (film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{uri: getImageFromApi(film.backdrop_path)}}
                    />
                    <Text style={styles.title_text}>{film.title}</Text>
                    <TouchableOpacity
                        style={styles.favorite_container}
                        onPress={() => _toggleFavorite()}>
                        {_displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.description_text}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note : {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes : {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget : {numeral(film.budget).format('0,0[.]00 $')}</Text>
                    <Text style={styles.default_text}>Genre(s) : {film.genres.map(function(genre){return genre.name;}).join(" / ")}</Text>
                    <Text style={styles.default_text}>Companie(s) : {film.production_companies.map(function(company){return company.name;}).join(" / ")}</Text>
                </ScrollView>
            )
        }
    }

    useEffect( () => {
        const favoriteFilmIndex = props.favoritesFilm.findIndex(item => item.id === props.navigation.state.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            setFilm(props.favoritesFilm[favoriteFilmIndex]);
            return() => {
                isCancelled.current = true;
                _updateNavigationParams();
            }
        }
        getFilmDetailFromApi(props.navigation.state.params.idFilm).then(data => {
            if (!isCancelled.current) {
                setFilm(data);
                setIsLoading(false);
            }
        });
        return() => {
            isCancelled.current = true;
            _updateNavigationParams();
        }
    });

    return (
        <View style={styles.main_container}>
            {_displayLoading()}
            {_displayFilm()}
            {_displayFloatingActionButton()}
        </View>
    );
}

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}
  
export default connect(mapStateToProps)(FilmDetail)