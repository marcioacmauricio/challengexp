import { READ_ALBUMS, FETCH_ALBUMS } from './types'
import { Token, Url } from '../Conf'

export const readAlbums = (albumId) => dispatch => {
	fetch(Url + 'albums/' + albumId, { 
		method : 'GET',
			headers : {
				'Authorization': 'Bearer ' + Token
			}
		})
		.then(
			res => res.json()
		)
		.then(
			albumsList => dispatch({
			type: READ_ALBUMS,
			payload: albumsList
		})
	);
}

export const fetchAlbums = (todoData) => dispatch => {
	let queryString = Object.keys(todoData).map(key => key + '=' + todoData[key]).join('&');
	fetch(Url + 'search?' + queryString , { 
		method : 'GET',
			headers : {
				'Authorization': 'Bearer ' + Token
			}
		})
		.then(
			res => res.json()
		)
		.then(
			albumsList => dispatch({
			type: FETCH_ALBUMS,
			payload: albumsList
		})
	);
}