import { createStore } from 'vuex'

import server from './module/server'
import user from './module/user'
import vacancy from './module/vacancy'


const store = createStore({
	modules: {
		server,
		user,
		vacancy
	}
});
export default store
