export async function getCredentials() {
	let credentials = {}
	const stringData = localStorage.getItem('credentials');
	console.log(stringData)
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

		//https://accounts.spotify.com/authorize?client_id=409f070cb44945d9a85e9b4ad8fa3bf1&redirect_uri=http%3A%2F%2Flocalhost%3A8000%2Fcallback.html&scope=user-read-private%20playlist-read-private%20playlist-modify-public%20playlist-modify-private%20user-library-read%20user-library-modify%20user-follow-read%20user-follow-modify&response_type=token
		var width = 450, height = 730, left = (screen.width / 2) - (width / 2), top = (screen.height / 2) - (height / 2);
		var w = await window.open(url, 'Spotify', 'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left );
		return false
	}
}