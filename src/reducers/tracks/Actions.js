import { READ_TRACKS, FETCH_TRACKS, NOTIFY_ERROR } from './types'
import { getCredentials } from '../../auth/getCredentials'
export function readTracks(tracksData) {
	const resource = Url + '/tracks/' + tracksData.id;
	return async (dispatch) => {

		let credentials = await getCredentials()
		if (!credentials){
			dispatch({
				type: FETCH_ALBUMS,
				payload: albumsList,
				queryParams: albumsData
			});		
			return	
		}
		try {
			const result = await fetch(
				resource, 
				{ 
					method : 'GET',
					headers : {
						'Authorization': 'Bearer ' + credentials.access_token
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
		let credentials = await getCredentials()
		if (!credentials){
			dispatch({
				type: FETCH_ALBUMS,
				payload: albumsList,
				queryParams: albumsData
			});		
			return	
		}

		try {
			const result = await fetch(
				resource + queryString, 
				{ 
					method : 'GET',
					headers : {
						'Authorization': 'Bearer ' + credentials.access_token
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