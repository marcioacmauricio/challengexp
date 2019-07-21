export async function getCredentials() {
	let credentials = {}
	const stringData = localStorage.getItem('credentials');
	if (stringData !== null){
		credentials = JSON.parse(stringData)
	}
	// 5 minutos antes de expirar ele deve solictar novo login
	let timeNow = new Date().getTime() - 300000
	if (credentials.expires_in > timeNow){
		return credentials
	} else {
		let Scopes = [
			'user-read-private',
			'playlist-read-private',
			'playlist-modify-public',
			'playlist-modify-private',
			'user-library-read',
			'user-library-modify',
			'user-follow-read',
			'user-follow-modify'
		]
		let Params = {
			client_id: "ff86be0df0f94dbbb4ba03082f63342a",
			response_type: "token",
			redirect_uri: "http://localhost:8080/",
			scope: encodeURI(Scopes.join(' '))
		}
		let url = "https://accounts.spotify.com/authorize?" +  Object.keys(Params).map(key => key + '=' + Params[key]).join('&');
		var width = 450, height = 730, left = (screen.width / 2) - (width / 2), top = (screen.height / 2) - (height / 2);
		var w = await window.open(url, 'Spotify', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left );
		return false
	}
}