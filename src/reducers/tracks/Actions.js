import { READ_TRACKS, FETCH_TRACKS } from './types'
import { Token, Url } from '../Conf'

export const readTracks = (albumId) => dispatch => {
	fetch(Url + 'tracks/' + albumId, { 
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
			type: READ_TRACKS,
			payload: albumsList
		})
	);
}



export const fetchTracks = (todoData) => dispatch => {
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
			type: FETCH_TRACKS,
			payload: albumsList
		})
	);TRACKS
}