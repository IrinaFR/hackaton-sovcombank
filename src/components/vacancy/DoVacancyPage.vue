<template lang="pug">
DoVacancyPageRecruiter(v-if="$store.getters.getUserPost === 'ROLE_RECRUTER'")
div(v-else)
	DoUiSubHeader(title="Просмотр вакансии" :back="true")
		button.btn.flex-grow-1(@click="$_vacancy_page_openModalResponse" v-if="$store.getters.getUserPost === 'ROLE_CANDIDAT'")
			img(src="/images/btn/document.svg")
			| Отклик
	.blockContent
		.titleBlock {{vacancy.position}}
		.form-group
			.size-14.color-grey.mb-1 Компания
			.bold {{vacancy.company}}
		.form-group
			.size-14.color-grey.mb-1 Обязанности
			div(v-html="vacancy.duties" v-if="vacancy.duties" )
			.bold(v-else) -
		.form-group
			.size-14.color-grey.mb-1 Город
			.bold {{vacancy.town || '-'}}
		.form-group
			.size-14.color-grey.mb-1 Вознаграждение от
			.bold {{vacancy.paymentFrom}}
		.form-group
			.size-14.color-grey.mb-1 Вознаграждение до
			.bold {{vacancy.paymentTo}}
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
					button.btn(:disabled="!modalResponseForm.resumeId||!modalResponseForm.coverLetter" @click="$_vacancy_page_sendResponse")
						img(src="/images/btn/send.svg")
						| Отправить
</template>

<script>
	import {defineAsyncComponent} from "vue";
	import DoUiTextEditor from "@/components/ui/DoUiTextEditor.vue";
	import vSelect from 'vue-select'
	export default {
		components: {
			DoUiTextEditor, vSelect,
			'DoVacancyPageRecruiter': defineAsyncComponent(() => import('./DoVacancyPageRecruiter'))
		},
		data(){
			return{
				vacancy: {},
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
			if(this.$store.getters.getUserPost !== 'ROLE_RECRUTER'){
				this.$_vacancy_page_loadVacancy()
			}
		},
		methods: {
			async $_vacancy_page_loadVacancy(){
				const res = await this.$store.getters.request('GET', 'vacancy/info/' + this.$route.params.idVacancy)
				if(res&&!res.error_description){
					this.vacancy = res
				}
			},
			async $_vacancy_page_openModalResponse(){
				const res = await this.$store.getters.request('GET', 'resume/all')
				if(res&&!res.error_description){
					this.summary = res.filter(s => s.userId === this.$store.getters.getUserId)
					if(this.summary.length) {
						this.modalResponseForm.resumeId = this.summary[0].id
						this.modalResponseForm.specialisation = this.summary[0].specialisation
					}
					this.modalResponseForm.position = this.vacancy.position
					this.modalResponseForm.userId = this.$store.getters.getUserId
					this.modalResponseForm.vacancyId = this.$route.params.id
					this.modalResponse = true
				}
				else this.$store.commit('addNotification', {
					type: 'danger',
					text: 'Произошла ошибка, попробуйте позже'
				})
			},
			async $_vacancy_page_sendResponse(){
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
		}
	}
</script>
