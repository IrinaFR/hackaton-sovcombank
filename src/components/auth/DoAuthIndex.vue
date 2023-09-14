<template lang="pug">
v-app(:theme="theme" v-cloak)
	v-main
		#main
			.container
				.mt-5.row.g-2
					.col--md-12.col-lg-12.mx-auto
						.bg-white.shadow.radius.p-card-40
							.mb-4.bold.size-23.text-center.color-black Цифровой офис
							.listTabs.responsive
								.tab(:class="{active:activeTab==='login'}" @click="activeTab='login'") Войти
								.tab(:class="{active:activeTab==='register'}" @click="activeTab='register'") Регистрация
							transition(name="fade" mode="out-in")
								.tabContent(v-if="activeTab==='login'")
									form(@submit.prevent="$_auth_index_login")
										.form-group
											label.form-label(for="login") Логин
											input.form-control#login(v-model="login.username" placeholder="Логин")
										.form-group
											label.form-label(for="loginPass") Пароль
											input.form-control#loginPass(type="password" v-model="login.password" placeholder="Пароль")
										button.btn.w-100(type="submit")
											img(src="/images/btn/login.svg")
											| Авторизация
								.tabContent(v-else)
									form(@submit.prevent="$_auth_index_registration")
										.form-group
											label.form-label(for="regLogin") Логин
											input.form-control#regLogin(v-model="v$.register.login.$model" placeholder="Логин" :class="{invalid:v$.register.login.$error}")
											.errorText(v-if="v$.register.login.required.$invalid") Обязательное поле
											.errorText(v-if="v$.register.login.alpha.$invalid") Указаны недопустимые символы
										.form-group
											label.form-label(for="regFirstname") Имя
											input.form-control#regFirstname(v-model="v$.register.firstname.$model" placeholder="Имя" :class="{invalid:v$.register.firstname.$error}")
											.errorText(v-if="v$.register.firstname.required.$invalid") Обязательное поле
											.errorText(v-if="v$.register.firstname.alpha.$invalid") Указаны недопустимые символы
										.form-group
											label.form-label(for="regLastname") Фамилия
											input.form-control#regLastname(v-model="v$.register.lastname.$model" placeholder="Фамилия" :class="{invalid:v$.register.lastname.$error}")
											.errorText(v-if="v$.register.lastname.required.$invalid") Обязательное поле
											.errorText(v-if="v$.register.lastname.alpha.$invalid") Указаны недопустимые символы
										.form-group
											label.form-label(for="regLastname") Возраст
											input.form-control#regLastname(v-model.number.trim="v$.register.age.$model" placeholder="Возраст" :class="{invalid:v$.register.age.$error}")
											.errorText Обязательное поле
										.form-group
											label.form-label(for="regPassword") Пароль
											input.form-control#regPassword(type="password" v-model="v$.register.password.$model" placeholder="Пароль" :class="{invalid:v$.register.password.$error}")
											.errorText(v-if="v$.register.password.required.$invalid") Обязательное поле
											.errorText(v-if="v$.register.password.minLength.$invalid") Минимальная длина 8 символов
										.form-group
											label.form-label(for="regRepeat") Повторите пароль
											input.form-control#regRepeat(type="password" v-model="v$.repeatPassword.$model" placeholder="Повторите пароль" :class="{invalid:v$.repeatPassword.$error}")
											.errorText Пароли не совпадают
										button.btn.w-100(type="submit" :disabled="v$.register.$invalid")
											img(src="/images/btn/user.svg")
											| Регистрация
				.mt-5.row.g-3
					.col-12.col-md-3
						.blockCard.flex-grow-1
							.titleCard Админ login/pawssword
							.my-3.color-grey.size-14 string
					.col-12.col-md-3
						.blockCard.flex-grow-1
							.titleCard Заказчик login/pawssword
							.my-3.color-grey.size-14 initiator
					.col-12.col-md-3
						.blockCard.flex-grow-1
							.titleCard Рекрутер login/pawssword
							.my-3.color-grey.size-14 recruiter
					.col-12.col-md-3
						.blockCard.flex-grow-1
							.titleCard Кандидат login/pawssword
							.my-3.color-grey.size-14 candidat
</template>

<script>
	import { required, minLength, sameAs} from '@vuelidate/validators'
	import { useVuelidate } from '@vuelidate/core'

	export default {
		data(){
			return{
				theme: 'light',
				activeTab: 'login',
				login: {
					username: '',
					password: ''
				},
				register: {
					login: "",
					password: "",
					firstname: "",
					lastname: "",
					age: 0,
					roleEnum: "ROLE_CANDIDAT"
				},
				repeatPassword: '',
				v$: useVuelidate()
			}
		},
		validations() {
			return {
				register: {
					login: {
						required,
						alpha: val => /^[a-zA-Zа-яА-Я0-9ёЁ\\s-]*$/i.test(val)
					},
					firstname: {
						required,
						alpha: val => /^[a-zA-Zа-яА-Я0-9ёЁ\\s-]*$/i.test(val)
					},
					lastname:{
						required,
						alpha: val => /^[a-zA-Zа-яА-Я0-9ёЁ\\s-]*$/i.test(val)
					},
					password:{
						required,
						minLength: minLength(8)
					},
					age:{
						required,
					},

				},
				repeatPassword: {
					required,
					sameAsPassword: sameAs(this.register.password)
				}
			}
		},
		created() {
			if(localStorage.theme){
				this.theme = JSON.parse(localStorage.getItem('theme'))
			} else{
				localStorage.setItem('theme', JSON.stringify(this.theme))
			}
		},
		methods: {
			async $_auth_index_login(){
				const res = await this.$store.getters.request('POST', 'users/login', this.login)
				if(res){
					this.$store.commit('userAuth', res)
					if(this.$route.query.redirect){
						this.$router.replace(this.$route.query.redirect)
					} else this.$router.replace('/vacancy')
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Авторизация прошла успешно'
					})
				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			},
			async $_auth_index_registration(){
				const res = await this.$store.getters.request('POST', 'users/register', this.register)
				if(res){
					this.activeTab = 'login'
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Регистрация прошла успешно'
					})
				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			}
		}
	}
</script>
