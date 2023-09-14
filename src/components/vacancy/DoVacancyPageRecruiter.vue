<template lang="pug">
DoUiSubHeader(title="Просмотр вакансии" :back="true")
div(v-if="loaded")
	.form-group
		label.form-label Активная вакансия -
			span.color-violet.ms-1 {{vacancyMy.length}}
		v-select(
			v-model="selectVacancyId"
			placeholder="Просмотр вакансии"
			label="position"
			:options="vacancyMy"
			:reduce="item => item.id"
			:clearable="false"
			@option:selected="$_vacancy_page_recruiter_selectVacancy")
			template(#no-options="{ search, searching }")
				span(v-if="searching") Совпадений не найдено
				span(v-else) Начните искать
	.form-group
		//.status(:class="`bg-${$store.getters.getStatusColor(vacancyMy.filter)}`")
	.row.mt-5.g-2(v-if="summary.length" )
		.col-12.col-md-3
			.blockCard
				.titleCard.mb-2 Отклики
				.userItem(v-for="user in summary" :class="{active:user.id===selectUser.id}" @click="selectUser=user")
					| {{user.firstName}} {{user.lastName}}
		.col-12.col-md-9
			.d-flex.justify-content-end.gap-10.mb-4
				button.btn.flex-grow-1(@click="modalStep=true")
					img(src="/images/btn/settings.svg")
					| Сменить этап
			.titleBlock {{selectUser.specialisation}}
			.form-group
				.size-14.color-grey.mb-1 ФИО
				.bold {{selectUser.lastName}} {{selectUser.firstName}} {{selectUser.middleName}}
			.form-group
				.size-14.color-grey.mb-1 Возраст
				.bold {{selectUser.age || '-'}}
			.form-group
				.size-14.color-grey.mb-1 Город
				.bold {{selectUser.city || '-'}}
			.form-group
				.size-14.color-grey.mb-1 О себе
				div(v-html="selectUser.about" v-if="selectUser.about" )
				.bold(v-else) -
			.form-group
				.size-14.color-grey.mb-1 Источник
				a.bold(:href="selectUser.link" v-if="selectUser.link" target="_blank") {{selectUser.source}}
				.bold(v-else)  {{selectUser.source}}
v-dialog(transition='dialog-top-transition' width='auto' v-model="modalStep" )
	v-card(height="200" )
		v-toolbar(color="violet" title='Пригласить кандидата')
		v-card-text
			.form-group
				label.form-label Этап
					span.color-violet.ms-1 *
				v-select(
					v-model="step"
					placeholder="Выберите этап"
					label="title"
					:options="$store.getters.getStatuses"
					:reduce="item => item.key"
					:clearable="false")
					template(#no-options="{ search, searching }")
						span(v-if="searching") Совпадений не найдено
						span(v-else) Начните искать
			.d-flex.gap-10.justify-center.mt-3
				button.btn(@click="modalStep=false")
					img(src="/images/btn/close.svg")
					| Отмена
				button.btn(@click="$_vacancy_page_changeStep")
					img(src="/images/btn/send.svg")
					| Изменить
</template>

<script>
	import vSelect from 'vue-select'
	export default {
		components: {
			vSelect,
		},
		data(){
			return{
				loaded: false,
				vacancyMy: [],
				selectVacancyId: {},
				selectVacancy: {
					id: 0
				},
				summary: [],
				selectUser: 0,
				modalStep: false,
				step: 'NEW'
			}
		},
		created() {
			this.$_vacancy_page_recruiter_loadVacancyMy()
		},
		methods: {
			$_vacancy_page_recruiter_selectVacancy(){
				this.selectVacancy = this.vacancyMy.filter(v => v.id === this.selectVacancyId)[0]
				this.$_vacancy_page_recruiter_getInfo()
			},
			async $_vacancy_page_recruiter_loadVacancyMy(){
				const res = await this.$store.getters.request('GET', 'vacancy/all/' + this.$store.getters.getUserId)
				if(res&&!res.error_description){
					this.vacancyMy = res
					if(this.vacancyMy.length) {
						this.selectVacancy = this.vacancyMy[0]
						this.selectVacancyId = this.vacancyMy[0].id
						this.$_vacancy_page_recruiter_getInfo()
					} else this.loaded = true
				}
			},
			async $_vacancy_page_recruiter_getInfo(){
				const res = await this.$store.getters.request('GET', 'reaction/all/vacancy/' + this.selectVacancyId)
				if(res&&!res.error_description){
					for (const reaction of res){
						const summary = await this.$store.getters.request('GET', 'resume/' + reaction.resumeId)
						if(summary&&!summary.error_description){
							this.summary.push(summary)
						}
					}
					if(this.summary.length) this.selectUser = this.summary[0]
				}
				this.loaded = true
			},
			async $_vacancy_page_changeStep(){
				this.selectVacancy.status = this.step
				const res = await this.$store.getters.request('PUT', 'vacancy/update', this.selectVacancy)
				if(res&&!res.error_description){
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Этап вакансии успешно изменён'
					})
				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
				this.modalStep = false
			}
		}
	}
</script>

<style scoped lang="scss">
	.userItem{
		display: flex;
		align-items: center;
		column-gap: 10px;
		padding: 10px 15px;
		margin: 0 -15px;
		@media(max-width: 576px){
			margin: 0 -10px;
			padding: 10px 10px;
		}
		&:hover{
			background: rgb(var(--v-theme-violet-bg));
			color:  rgb(var(--v-theme-violet));
		}
		&.active{
			background: rgb(var(--v-theme-violet));
			color:  rgb(var(--v-theme-white));
		}
	}
</style>
