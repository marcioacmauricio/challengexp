import { READ_ALBUMS, FETCH_ALBUMS } from './types'

let Url = "https://api.spotify.com/v1/"
let Token = "BQCNO8o8UlCUYhoEIhOY9VLtd8QfRWswz2eKWZ4AApWqe5TwVyZorr4t7BFZTLUV122vvx3MAiQR-Sl19J39E7jJ22GspkQqW27ipF5uLVQKNUs39RZp2eKRbFkIFVI_aXAu0uDQ3nu2kUx77w3N76EFBHtoOezNtWG-PvwdRbNvpwM"

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