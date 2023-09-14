const vacancy = {
	state: () => ({
		status: [
			{title: 'Новая', color: 'violet', key: 'NEW'},
			{title: 'Поиск кандидатов', color: 'violet', key: 'IN_PROGRESS'},
			{title: 'В ожидании', color: 'orange', key: 'ON_APPROVAL'},
			{title: 'Собеседование', color: 'blue', key: 'INTERVIEW'},
			{title: 'Оффер кандидату', color: 'violet', key: 'OFFER'},
			{title: 'Закрыта', color: 'green', key: 'CLOSED'},
		],
	}),
	getters: {
		// TODO Получить статусы
		getStatuses: (state) => {
			return state.status
		},
		// TODO Получить цвет статуса
		getStatusColor: (state) => key => {
			return state.status.filter(s => s.key === key)[0].color
		},
		// TODO Получить тайтл статуса
		getStatusTitle: (state) => key => {
			return state.status.filter(s => s.key === key)[0].title
		},

	},
}

export default vacancy
