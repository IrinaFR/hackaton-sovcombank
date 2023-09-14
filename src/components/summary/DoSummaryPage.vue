<template lang="pug">
DoUiSubHeader(title="Резюме соискателя")
	router-link.btn(:to="`/summary/edit/${resume.id}`" v-if="$store.getters.getUserPost === 'ROLE_CANDIDAT'" :back="true")
		img(src="/images/btn/edit.svg")
		| Изменить
	button.btn.flex-grow-1(@click="$_summary_page_openModalInvite"  v-if="$store.getters.getUserPost === 'ROLE_RECRUTER'")
		img(src="/images/btn/addMan.svg")
		| Пригласить
.blockContent
	.titleBlock {{resume.specialisation}}
	.form-group(v-if="$store.getters.getUserPost === 'ROLE_CANDIDAT'" )
		.size-14.color-grey.mb-1 Статус
		.bold {{resume.status === 'ACTIVE' ? 'Активно' : 'Скрыто'}}
	.form-group
		.size-14.color-grey.mb-1 ФИО
		.bold {{resume.lastName}} {{resume.firstName}} {{resume.middleName}}
	.form-group
		.size-14.color-grey.mb-1 Возраст
		.bold {{resume.age || '-'}}
	.form-group
		.size-14.color-grey.mb-1 Город
		.bold {{resume.city || '-'}}
	.form-group
		.size-14.color-grey.mb-1 О себе
		div(v-html="resume.about" v-if="resume.about" )
		.bold(v-else) -
	.form-group
		.size-14.color-grey.mb-1 Источник
		a.bold(:href="resume.link" v-if="resume.link" target="_blank") {{resume.source}}
		.bold(v-else)  {{resume.source}}
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
				button.btn(:disabled="!modalInviteForm.vacancyId||!modalInviteForm.inviteLetter" @click="$_summary_page_inviteCandidate")
					img(src="/images/btn/addMan.svg")
					| Пригласить
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
				resume: {
					id: 0
				},
				// модалка приглашения
				modalInvite: false,
				vacancy: [],
				modalInviteForm: {
					vacancyId: 0,
					resumeId: 0,
					userId: 0,
					inviteLetter: '',
					coverLetter: '',
					status: 'NEW'
				}
			}
		},
		created() {
			this.$_summary_page_loadVacancy()
		},
		methods: {
			async $_summary_page_loadVacancy(){
				const res = await this.$store.getters.request('GET', 'resume/' + this.$route.params.idSummary)
				if(res&&!res.error_description){
					this.resume = res
				} else {
					this.$store.commit('addNotification', {
						type: 'danger',
						text: 'Произошла ошибка, попробуйте позже'
					})
					this.$router.replace('/vacancy')
				}
			},
			async $_summary_page_openModalInvite(){
				const res = await this.$store.getters.request('GET', 'vacancy/all/' + this.$store.getters.getUserId)
				if(res&&!res.error_description){
					this.vacancy = res
					if(this.vacancy.length) this.modalInviteForm.vacancyId = this.vacancy[0].id
					this.modalInviteForm.userId = this.resume.userId
					this.modalInviteForm.resumeId = this.resume.id
					this.modalInvite = true
				} else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			},
			async $_summary_page_inviteCandidate(){
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
		}
	}
</script>
