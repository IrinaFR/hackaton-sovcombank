<template lang="pug">
DoUiSubHeader(title="Заявки" v-if="$route.name==='vacancy'" )
	router-link.btn(to="/vacancy/add" v-if="isRecruiter")
		img(src="/images/btn/add.svg")
		| Разместить заявку
.pageVacancy(v-if="$route.name==='vacancy'")
	div
		.titleBlock Открытые вакансии
		.row.g-2
			.col-12.col-md-6.col-lg-4(v-for="vacancy in vacancyOpen")
				.blockCard
					.titleCard {{vacancy.position}}
					.d-flex.align-center.gap-10.mt-2
						.size-15.color-grey {{vacancy.company}} -
						.size-15.color-grey {{vacancy.town}}
					.status(
						:class="`bg-${$store.getters.getStatusColor(vacancy.status)}`"
						v-if="$store.getters.getUserPost !== 'ROLE_CANDIDAT'"
						) {{$store.getters.getStatusTitle(vacancy.status)}}
					.d-flex.align-center.gap-10.mt-2
						router-link.btn.flex-grow-1(:to="`/vacancy/${vacancy.id}`")
							img(src="/images/btn/document.svg")
							| Подробнее
						router-link.btn.flex-grow-1(:to="`/vacancy/edit/${vacancy.id}`" v-if="isRecruiter")
							img(src="/images/btn/edit.svg")
							| Изменить
						button.btn.flex-grow-1(@click="$_vacancy_index_openModalResponse(vacancy)" v-else)
							img(src="/images/btn/document.svg")
							| Отклик

	.mt-5(v-if="vacancyMy.length&&isRecruiter")
		.titleBlock У меня в работе -
			span.color-violet.ms-1 {{vacancyMy.length}}
		.row.g-2
			.col-12.col-md-6.col-lg-4(v-for="vacancy in vacancyMy")
				.blockCard
					.titleCard {{vacancy.position}}
					.d-flex.align-center.gap-10.mt-2
						.size-15.color-grey {{vacancy.company}} -
						.size-15.color-grey {{vacancy.town}}
					.status(:class="`bg-${$store.getters.getStatusColor(vacancy.status)}`") {{$store.getters.getStatusTitle(vacancy.status)}}
					.d-flex.align-center.gap-10.mt-3
						router-link.btn.flex-grow-1(:to="`/vacancy/${vacancy.id}`")
							img(src="/images/btn/document.svg")
							| Подробнее
						router-link.btn.flex-grow-1(:to="`/vacancy/edit/${vacancy.id}`")
							img(src="/images/btn/edit.svg")
							| Изменить
	.mt-5(v-if="vacancyArchive.length")
		.titleBlock Архив
		.form-group
			input.form-control(placeholder="Поиск" v-model="search" @input="$_vacancy_index_searchArchive")
		.row.g-2
			.col-12.col-md-6.col-lg-4(v-for="vacancy in vacancyArchive")
				.blockCard
					.titleCard {{vacancy.position}}
					.d-flex.align-center.gap-10.mt-2
						.size-15.color-grey {{vacancy.company}} -
						.size-15.color-grey {{vacancy.town}}
					.status(:class="`bg-${$store.getters.getStatusColor(vacancy.status)}`") {{$store.getters.getStatusTitle(vacancy.status)}}
					.d-flex.align-center.gap-10.mt-3
						router-link.btn.flex-grow-1(:to="`/vacancy/${vacancy.id}`")
							img(src="/images/btn/document.svg")
							| Подробнее
						router-link.btn.flex-grow-1(:to="`/vacancy/edit/${vacancy.id}`")
							img(src="/images/btn/edit.svg")
							| Изменить
v-dialog(transition='dialog-top-transition' width='auto' v-model="modalResponse" )
	v-card
		v-toolbar(color="violet" title='Отправить отклик')
		v-card-text
			.form-group(v-if="summary.length" )
				label.form-label Выберите резюме
					span.color-violet.ms-1 *
				v-select(
					v-model="modalResponseForm.resumeId"
					placeholder="Выберите резюме"
					label="specialisation"
					:options="summary"
					:reduce="item => item.id"
					:clearable="false")
					template(#no-options="{ search, searching }")
						span(v-if="searching") Совпадений не найдено
						span(v-else) Начните искать
			.form-group.text-center(v-else)
				label.form-label У вас нет созданных резюме
				router-link.btn.mt-2(to="/summary/add")
					img(src="/images/btn/add.svg")
					| Создать резюме
			.form-group
				label.form-label Сопроводительное письмо
					span.color-violet.ms-1 *
				DoUiTextEditor(v-model="modalResponseForm.coverLetter")
			.d-flex.gap-10.justify-center.mt-3
				button.btn(@click='modalResponse = false')
					img(src="/images/btn/close.svg")
					| Отмена
				button.btn(:disabled="!modalResponseForm.resumeId||!modalResponseForm.coverLetter" @click="$_vacancy_index_sendResponse")
					img(src="/images/btn/send.svg")
					| Отправить
router-view
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
				vacancyAll: [],
				vacancyOpen: [],
				vacancyMy: [],
				vacancyArchive: [],
				isRecruiter: false,
				search: '',
				// модалка отклика
				modalResponse: false,
				summary: [],
				modalResponseForm: {
					vacancyId: 0,
					resumeId: 0,
					userId: 0,
					inviteLetter: '',
					coverLetter: '',
					status: 'NEW',
					specialisation: '',
					position: ''
				}
			}
		},
		created() {
			this.$_vacancy_index_getVacancyAll()
			if(this.$store.getters.getUserPost === 'ROLE_RECRUTER') {
				this.$_vacancy_index_getVacancyMy()
				this.isRecruiter = true
			}
		},
		methods: {
			async $_vacancy_index_getVacancyAll(){
				const res = await this.$store.getters.request('GET', 'vacancy/all')
				if(res&&!res.error_description){
					this.vacancyAll = Object.assign([], res)
					this.vacancyOpen = res.filter(v => (v.userId !== this.$store.getters.getUserId && v.status !== 'CLOSED'))
					if(this.$store.getters.getUserPost !== 'ROLE_CANDIDAT')	this.vacancyArchive = res.filter(v => v.status === 'CLOSED')
				}
			},
			async $_vacancy_index_getVacancyMy(){
				const res = await this.$store.getters.request('GET', 'vacancy/all/' + this.$store.getters.getUserId)
				if(res&&!res.error_description){
					this.vacancyMy = res
				}
			},
			$_vacancy_index_searchArchive(){
				this.vacancyArchive = this.vacancyAll.filter(v => (v.status === 'CLOSED' && v.position.toLowerCase().includes(this.search.toLowerCase())))
			},
			async $_vacancy_index_openModalResponse(vacancy){
				const res = await this.$store.getters.request('GET', 'resume/all')
				if(res&&!res.error_description){
					this.summary = res.filter(s => s.userId === this.$store.getters.getUserId)
					if(this.summary.length) {
						this.modalResponseForm.resumeId = this.summary[0].id
						this.modalResponseForm.specialisation = this.summary[0].specialisation
					}
					this.modalResponseForm.position = vacancy.position
					this.modalResponseForm.userId = this.$store.getters.getUserId
					this.modalResponseForm.vacancyId = vacancy.id
					this.modalResponse = true
				}
				else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			},
			async $_vacancy_index_sendResponse(){
				const res = await this.$store.getters.request('POST', 'reaction/create', this.modalResponseForm)
				if(res&&!res.error_description){
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Отклик успешно отправлен'
					})
				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
				this.modalResponse = false
			}
		},
		beforeRouteUpdate(to, from, next){
			if(from.name === 'vacancyEdit' || from.name === 'vacancyPage') {
				this.$_vacancy_index_getVacancyAll()
				if(this.$store.getters.getUserPost === 'ROLE_RECRUTER') {
					this.$_vacancy_index_getVacancyMy()
					this.isRecruiter = true
				}
				next()
			} else next()
		}
	}
</script>

<style scoped lang="scss">
	.status{
		padding: 5px 10px;
		border-radius: 10px;
		color: rgb(var(--v-theme-white));
		width: fit-content;
		margin-top: 15px;
	}
</style>
