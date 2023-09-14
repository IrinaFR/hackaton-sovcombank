<template lang="pug">
DoUiSubHeader(:title="`${editMode?'Изменить':'Разместить'} заявку`" :back="true")
	button.btn(@click="$router.go(-1)")
		img(src="/images/btn/close.svg")
		| Отмена
	button.btn(@click="$_vacancy_add_addVacancy" v-if="!editMode" )
		img(src="/images/btn/save.svg")
		| Разместить
	button.btn(@click="$_vacancy_add_editVacancy" v-else)
		img(src="/images/btn/save.svg")
		| Изменить
.blockContent
	.titleBlock Основная информация
	.row.form-group.g-2
		.col-12
			label.form-label(for="post") Название должности
				span.color-violet.ms-1 *
			input.form-control#post(v-model="form.position" placeholder="Название")
		.col-12.col-md-6(v-if="editMode")
			label.form-label Статус вакансии
			v-select(
				v-model="form.status"
				placeholder="Статус"
				label="title"
				:options="$store.getters.getStatuses"
				:reduce="item => item.key"
				:clearable="false"
				:searchable="false")
	.row.form-group.g-2
		.col-12.col-md-6
			label.form-label(for="paymentFrom") Вознаграждение от
				span.color-violet.ms-1 *
			input.form-control#paymentFrom(placeholder="Вознаграждение от" v-model="form.paymentFrom" )
		.col-12.col-md-6
			label.form-label(for="paymentTo") Вознаграждение до
			input.form-control#paymentTo(placeholder="Вознаграждение до"  v-model="form.paymentTo")
	.row.form-group.g-2
		.col-12.col-md-6
			label.form-label(for="company") Компания
				span.color-violet.ms-1 *
			input.form-control#company(placeholder="Компания" v-model="form.company" )
		.col-12.col-md-6
			label.form-label(for="town") Город
			input.form-control#town(placeholder="Город"  v-model="form.town")
	.row.form-group.g-2
		.col-12
			label.form-label(for="post") Обязанности
			DoUiTextEditor(v-model="form.duties")
.blockContent
	.titleBlock Дополнительная информация
	.row.form-group.g-2
		.col-12.col-md-6
			label.form-label(for="post") Исполнитель заявки
			v-select(
				v-model="form.userId"
				placeholder="Исполнитель заявки"
				:options="recruiters"
				label="fullName"
				:reduce="item => item.userId"
				:clearable="false"
				:searchable="false")

</template>

<script>
	import vSelect from 'vue-select'
	import DoUiTextEditor from "@/components/ui/DoUiTextEditor.vue";
	export default {
		components: {
			vSelect, DoUiTextEditor
		},
		data(){
			return{
				editMode: false,
				idVacancy: 0,
				form: {
					userId: this.$store.getters.getUserId,
					company: "",
					position: "",
					duties: "",
					status: "NEW",
					paymentFrom: "",
					paymentTo: "",
					town: ""
				},
				experience: '',
				experienceArr: ['Без опыта', '1-3 года', '3-5 лет', 'Более 5 лет'],
				recruiters: []
			}
		},
		created() {
			this.$_vacancy_add_getRecruiters()
			if(this.$route.name==='vacancyEdit') {
				this.editMode = true
				this.idVacancy = +this.$route.params.idVacancy
				this.$_vacancy_add_loadVacancy()
			}
		},
		methods: {
			async $_vacancy_add_getRecruiters(){
				const res = await this.$store.getters.request('GET', 'users/recruiters')
				if(res&&!res.error_description){
					res.forEach(r => {
						r.fullName = r.firstname + ' ' + r.lastName
					})
					this.recruiters = res
				}
			},
			async $_vacancy_add_addVacancy(){
				if(this.form.userId===null) this.form.userId = 0
				const res = await this.$store.getters.request('POST', 'vacancy/create', this.form)
				if(res&&!res.error_description){
					this.$router.replace('/vacancy')
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Вакансия успешно создана'
					})
				} else if(res.error_description){
					this.$store.commit('addNotification', {
						type: 'danger',
						text: res.error_description
					})
				}
				else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			},
			async $_vacancy_add_loadVacancy(){
				const res = await this.$store.getters.request('GET', 'vacancy/info/' + this.idVacancy)
				if(res&&!res.error_description){
					this.form = res
				}
			},
			async $_vacancy_add_editVacancy(){
				const res = await this.$store.getters.request('PUT', 'vacancy/update', this.form)
				if(res&&!res.error_description){
					this.$router.replace('/vacancy')
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Вакансия успешно изменена'
					})
				} else if(res.error_description){
					this.$store.commit('addNotification', {
						type: 'danger',
						text: res.error_description
					})
				}
				else this.$store.commit('addNotification', {
						type: 'danger',
						text: 'Произошла ошибка, попробуйте позже'
					})
			},
		}
	}
</script>
