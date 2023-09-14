const user = {
	state: () => ({
		profile: {},
		auth: false,
		isApp: process.env.VUE_APP_IS_APP,
		roles: [
			{title: 'Админ', key: 'ROLE_ADMIN'},
			{title: 'Соискатель', key: 'ROLE_CANDIDAT'},
			{title: 'Рекрутер', key: 'ROLE_RECRUTER'},
			{title: 'Заказчик', key: 'ROLE_INITIATOR'},
			{title: 'Руководитель', key: 'ROLE_DIRECTOR'},
		],
		status: [
			{title: 'Новая', key: 'NEW', color: 'violet'},
			{title: 'Поиск кандидатов', key: 'IN_PROGRESS', color: 'violet'},
			{title: 'На одобрении', key: 'ON_APPROVAL', color: 'orange'},
			{title: 'Собеседование', key: 'INTERVIEW', color: 'blue'},
			{title: 'Оффер кандидату', key: 'OFFER', color: 'violet'},
			{title: 'Закрыта', key: 'CLOSED', color: 'green'},
		],
		notifications: [],
	}),
	getters: {
		// TODO Авторизован ли пользователь
		getAuth: state => {
			return state.auth
		},
		// TODO Получение имени пользователя
		getUserName: state => {
			return state.profile.username
		},
		// TODO Получение id пользователя
		getUserId: state => {
			return state.profile.userId
		},
		// TODO Получение роли пользователя
		getUserPost: state => {
			return state.profile.role
		},
		// TODO Получение имени роли пользователя
		getUserPostName: state => {
			const role = state.roles.filter(r => r.key === state.profile.role)
			if(role[0]) return role[0].title
			else return false
		},
		// TODO админ или нет
		getUserAdmin: state => {
			return state.profile.role === 'ROLE_ADMIN'
		},
		// TODO Приложение или нет
		getApp: state => {
			return state.isApp
		},
		//TODO получить список уведомлений
		getNotifications: state => {
			return state.notifications
		},
	},
	actions: {
		// TODO Авторизация
		async userLogin({commit, data}) {
			const res = await this.getters.request('POST', 'users/login', data, false)
			if (res) {
				await commit('userAuth', res)
			}
		},
		//TODO запрос на завершение сессии
		async exitAuth({commit}) {
			await this.getters.request('GET', 'users/logout', {}, true)
			commit('exitUserAuth')
		},
	},
	mutations: {
		// TODO Завершение сессии локально
		exitUserAuth(state){
			state.auth = false
			state.profile = {}
			if (state.app) {
				localStorage.removeItem("reference");
			}
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			location.reload()
		},
		// TODO Авторизация локально
		userAuth(state, user) {
			localStorage.setItem('token', JSON.stringify(user.token))
			state.profile = {
				username: user.username,
				role: user.role,
				userId: user.userId
			}
			localStorage.setItem('user', JSON.stringify(state.profile))
			state.auth = true
		},
		//TODO уведомления
		addNotification(state, data) {
			if (data.del !== undefined) state.notifications.splice(data.del, 1);
			else {
				if (data.type === 'basket') {
					state.notifications.unshift({
						type: data.type,
						text: data.text,
						id: new Date().getTime(),
					});
				} else {
					state.notifications.unshift({type: data.type, text: data.text, id: new Date().getTime()});
				}
				setTimeout(() => {
					state.notifications.splice(-1, 1)
				}, 10000)
			}
		},
	}
}

export default user
