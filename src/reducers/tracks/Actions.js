import { READ_TRACKS, FETCH_TRACKS, NOTIFY_ERROR } from './types'
import { Token, Url } from '../Conf'

export function readTracks(tracksData) {
	const resource = Url + '/tracks/' + tracksData.id;
	return async (dispatch) => {
		try {
			const result = await fetch(
				resource, 
				{ 
					method : 'GET',
					headers : {
						'Authorization': 'Bearer ' + Token
					}
				}
			)
			const tracksList = await result.json()
			dispatch({
				type: READ_TRACKS,
				payload: tracksList,
				queryParams: tracksData
			});
		} catch (error) {
			console.log(error)
			dispatch({
				type: NOTIFY_ERROR,
				payload: error,
				queryParams: tracksData
			});
		}
	};
}

export function fetchTracks(tracksData) {
	const resource = Url + '/search?';
	let queryString = Object.keys(tracksData).map(key => key + '=' + tracksData[key]).join('&');
	return async (dispatch) => {
		try {
			const result = await fetch(
				resource + queryString, 
				{ 
					method : 'GET',
					headers : {
						'Authorization': 'Bearer ' + Token
					}
				}
			)
			const tracksList = await result.json()
			dispatch({
				type: FETCH_TRACKS,
				payload: tracksList,
				queryParams: tracksData
			});
		} catch (error) {
			console.log(error)
			dispatch({
				type: NOTIFY_ERROR,
				payload: error,
				queryParams: tracksData
			});
		}
	};
}