<template lang="pug">
DoUiSubHeader(:title="`${editMode?'Изменить':'Создание'} резюме`" :back="true")
	button.btn(@click="$router.go(-1)")
		img(src="/images/btn/close.svg")
		| Отмена
	button.btn(@click="$_summary_add_addSummary" v-if="!editMode")
		img(src="/images/btn/save.svg")
		| Создать
	button.btn(@click="$_summary_add_editSummary" v-else)
		img(src="/images/btn/edit.svg")
		| Изменить
.blockContent
	.titleBlock Основная информация
	.form-group-check
		input.form-check-input#status(v-model="form.status" type="checkbox" true-value="ACTIVE" false-value="INACTIVE")
		label.form-check-label(for="status") Резюме активно
	.row.form-group.g-2
		.col-12
			label.form-label(for="family") Название должности
				span.color-violet.ms-1 *
			input.form-control#family(placeholder="Желаемая должность" v-model="form.specialisation" )
	.row.form-group.g-2
		.col-12.col-md-6
			label.form-label(for="family") Фамилия
				span.color-violet.ms-1 *
			input.form-control#family(placeholder="Фамилия" v-model="form.lastName" )
		.col-12.col-md-6
			label.form-label(for="name") Имя
				span.color-violet.ms-1 *
			input.form-control#name(placeholder="Имя"  v-model="form.firstName")
	.row.form-group.g-2
		.col-12.col-md-6
			label.form-label(for="surname") Отчество
				span.color-violet.ms-1 *
			input.form-control#surname(placeholder="Отчество" v-model="form.middleName" )
		.col-12.col-md-6
			label.form-label(for="age") Возраст
				span.color-violet.ms-1 *
			input.form-control#age(placeholder="Возраст"  v-model.number.trim="form.age")
	.row.form-group.g-2
		.col-12.col-md-6
			label.form-label(for="city") Город
			input.form-control#city(placeholder="Город" v-model="form.city")
		.col-12.col-md-6
			label.form-label Образование
			v-select(
				v-model="form.education"
				placeholder="Образование"
				:options="educationArr"
				:clearable="false"
				:searchable="false")
	.row.form-group.g-2
		.col-12
			label.form-label О себе
			DoUiTextEditor(v-model="form.about")
	//.row.form-group
		//.col-12.col-md-6
		//	label.form-label Специализация
		//	v-select(
		//		v-model="form.specialisation"
		//		placeholder="Специализация"
		//		label="name"
		//		:selectable="item => item.parent_id"
		//		:options="specialisationArr"
		//		:reduce="item => item.name"
		//		:clearable="false")
		//		template(#no-options="{ search, searching }")
		//			span(v-if="searching") Совпадений не найдено
		//			span(v-else) Начните искать
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
				idSummary: 0,
				form: {
					userId: this.$store.getters.getUserId,
					firstName: "",
					lastName: "",
					middleName: "",
					specialisation: "",
					education: "",
					age: 0,
					city: "",
					status: "ACTIVE", // показывать или нет
					source: "", // откуда резюме
					about: "",
					link: "", // ссылка на сервис
					partnerId: 0 // id сервиса
				},
				educationArr: [
					"Среднее",
					"Среднее специальное",
					"Неоконченное высшее",
					"Высшее",
					"Бакалавр",
					"Магистр",
					"Кандидат наук",
					"Доктор наук"
				],
			}
		},
		created() {
			if(this.$route.name==='summaryEdit') {
				this.editMode = true
				this.idSummary = +this.$route.params.idSummary
				this.$_summary_add_loadSummary()
			}
		},
		methods: {
			async $_summary_add_addSummary(){
				const res = await this.$store.getters.request('POST', 'resume/create', this.form)
				if(res&&!res.error_description){
					this.$router.replace('/vacancy')
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Резюме успешно добавлено'
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
			async $_summary_add_loadSummary(){
				const res = await this.$store.getters.request('GET', 'resume/' + this.idSummary)
				if(res&&!res.error_description){
					this.form = res
				}
			},
			async $_summary_add_editSummary(){
				const res = await this.$store.getters.request('PUT', 'resume/update', this.form)
				if(res&&!res.error_description){
					this.$router.replace('/summary')
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Резюме успешно изменено'
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
