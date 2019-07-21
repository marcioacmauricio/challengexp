import { READ_ALBUMS, FETCH_ALBUMS, NOTIFY_ERROR } from './types'
import { getCredentials } from '../../auth/getCredentials'
export function readAlbums(albumsData) {
	const resource = Url + '/albums/' + albumsData.id;
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
			const albumsList = await result.json()
			dispatch({
				type: READ_ALBUMS,
				payload: albumsList,
				queryParams: albumsData
			});
		} catch (error) {
			console.log(error)
			dispatch({
				type: NOTIFY_ERROR,
				payload: error,
				queryParams: albumsData
			});
		}
	};
}

export function fetchAlbums(albumsData) {
	const resource = Url + '/search?';
	let queryString = Object.keys(albumsData).map(key => key + '=' + albumsData[key]).join('&');

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
			const albumsList = await result.json()
			dispatch({
				type: FETCH_ALBUMS,
				payload: albumsList,
				queryParams: albumsData
			});
		} catch (error) {
			console.log(error)
			dispatch({
				type: NOTIFY_ERROR,
				payload: error,
				queryParams: albumsData
			});
		}
	};
}