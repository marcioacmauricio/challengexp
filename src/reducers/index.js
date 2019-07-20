import { combineReducers } from 'redux'
import albumsReducer from './albums/reducer'
import tracksReducer from './tracks/reducer'
export default combineReducers({
	albumsReducer,
	tracksReducer
})