<template lang="pug">
DoUiSubHeader(:title="title" v-if="$route.name==='summary'")
	router-link.btn(to="/summary/add" v-if="!isRecruiter" )
		img(src="/images/btn/add.svg")
		| Добавить резюме
.pageVacancy(v-if="$route.name==='summary'")
	div(v-if="!isRecruiter")
		.row.g-2(v-if="summaryMy.length" )
			.col-12.col-md-6.col-lg-4(v-for="summary in summaryMy")
				.blockCard
					.status {{summary.status === 'ACTIVE' ? 'Активно' : 'Скрыто'}}
					.titleCard {{summary.specialisation}}
					.mt-2.mb-3.size-15.color-grey {{summary.city}}
					.d-flex.align-center.gap-10
						router-link.btn.flex-grow-1(:to="`/summary/${summary.id}`")
							img(src="/images/btn/document.svg")
							| Подробнее
						router-link.btn.flex-grow-1(:to="`/summary/edit/${summary.id}`")
							img(src="/images/btn/edit.svg")
							| Изменить
		.w-100.text-center.mt-5(v-else) У вас ещё нет созданных резюме
			router-link.btn.mt-3(to="/summary/add")
				img(src="/images/btn/add.svg")
				| Добавить резюме
	div(v-else)
		.form-group
			input.form-control(v-model="search" placeholder="Поиск резюме по названию" @input="$_summary_index_searchSummary")
		.row.g-2
			.col-12.col-md-6.col-lg-4(v-for="summary in summaryActive")
				.blockCard
					.status Активно
					.titleCard {{summary.specialisation}}
					.mt-2.mb-3.size-15.color-grey {{summary.city}}
					.d-flex.align-center.gap-10
						router-link.btn.flex-grow-1(:to="`/summary/${summary.id}`")
							img(src="/images/btn/document.svg")
							| Подробнее
						button.btn.flex-grow-1(@click="$_summary_index_openModalInvite(summary)")
							img(src="/images/btn/addMan.svg")
							| Пригласить
v-dialog(transition='dialog-top-transition' width='auto' v-model="modalInvite" )
	v-card
		v-toolbar(color="violet" title='Пригласить кандидата')
		v-card-text
			.form-group(v-if="vacancy.length")
				label.form-label На какую вакансию
					span.color-violet.ms-1 *
				v-select(
					v-model="modalInviteForm.vacancyId"
					placeholder="Выберите вакансию"
					label="position"
					:options="vacancy"
					:reduce="item => item.id"
					:clearable="false")
					template(#no-options="{ search, searching }")
						span(v-if="searching") Совпадений не найдено
						span(v-else) Начните искать
			.form-group.text-center(v-else)
				label.form-label У вас нет вакансий в работе
				router-link.btn.mt-2(to="/vacancy")
					img(src="/images/btn/employers.svg")
					| Взять в работу вакансию
			.form-group
				label.form-label Пригласительное письмо
					span.color-violet.ms-1 *
				DoUiTextEditor(v-model="modalInviteForm.inviteLetter")
			.d-flex.gap-10.justify-center.mt-3
				button.btn(@click="modalInvite=false")
					img(src="/images/btn/close.svg")
					| Отмена
				button.btn(:disabled="!modalInviteForm.vacancyId||!modalInviteForm.inviteLetter" @click="$_summary_index_inviteCandidate")
					img(src="/images/btn/addMan.svg")
					| Пригласить

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
				title: 'Мои резюме',
				summaryAll: [],
				summaryActive: [],
				summaryMy: [],
				isRecruiter: false,
				search: '',
				// модалка приглашения
				modalInvite: false,
				vacancy: [],
				modalInviteForm: {
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
			if(this.$store.getters.getUserPost === 'ROLE_RECRUTER'||this.$store.getters.getUserPost === 'ROLE_CANDIDAT'){
				this.$_summary_index_getSummaryAll()
				if(this.$store.getters.getUserPost === 'ROLE_RECRUTER') {
					this.title = 'Список резюме'
					this.isRecruiter = true
				}
			} else this.$router.replace('/vacancy')
		},
		methods: {
			async $_summary_index_getSummaryAll(){
				const res = await this.$store.getters.request('GET', 'resume/all')
				if(res&&!res.error_description){
					this.summaryAll = Object.assign([], res)
					this.summaryActive = res.filter(v => (v.userId !== this.$store.getters.getUserId && v.status === 'ACTIVE'))
					this.summaryMy = res.filter(v => v.userId === this.$store.getters.getUserId)
				}
			},
			$_summary_index_searchSummary(){
				this.summaryActive = this.summaryAll.filter(v => (v.userId !== this.$store.getters.getUserId && v.status === 'ACTIVE' && v.specialisation.toLowerCase().includes(this.search.toLowerCase()) ))
			},
			async $_summary_index_openModalInvite(summary){
				const res = await this.$store.getters.request('GET', 'vacancy/all/' + this.$store.getters.getUserId)
				if(res&&!res.error_description){
					this.vacancy = res
					if(this.vacancy.length) {
						this.modalInviteForm.vacancyId = this.vacancy[0].id
						this.modalInviteForm.position = this.vacancy[0].position
					}
					this.modalInviteForm.specialisation = summary.specialisation
					this.modalInviteForm.userId = summary.userId
					this.modalInviteForm.resumeId = summary.id
					this.modalInvite = true
				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			},
			async $_summary_index_inviteCandidate(){
				const res = await this.$store.getters.request('POST', 'reaction/create', this.modalInviteForm)
				if(res&&!res.error_description){
					this.$store.commit('addNotification', {
						type: 'success',
						text: 'Приглашение успешно отправлено'
					})				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
				this.modalInvite = false
			}
		},
		beforeRouteUpdate(to, from, next){
			if(from.name === 'summaryEdit' || from.name === 'summaryAdd') {
				this.$_summary_index_getSummaryAll()
				next()
			} else next()
		}
	}
</script>

<style scoped lang="scss">
	.status{
		margin: 15px 0;
	}
</style>
