import axios from 'axios'

const url = process.env.VUE_APP_SERVER
const server = {
	state: () => ({
		url
	}),
	getters: {
		getUrlApi: (state) => {
			return state.url
		},
		getUserToken: () => {
			return localStorage.getItem('token')||localStorage.getItem('token')!=='undefined'?JSON.parse(localStorage.getItem('token')):undefined
		},
		request:(state, getters)=>async (method, url, formData)=>{
			try {
				const {data} = await axios({
					method,
					url: encodeURI(getters.getUrlApi + url),
					data: formData,
					headers: {
						Authorization: 'Bearer ' + getters.getUserToken
					}
				})
				if (data) {
					return data;
				}
				console.warn('Error request')
			} catch (error) {
				console.warn('Error', error);
				return false
			}
		},
	}
}

export default server
