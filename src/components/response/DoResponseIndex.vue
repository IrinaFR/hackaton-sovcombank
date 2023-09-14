<template lang="pug">
DoUiSubHeader(title="Отклики и приглашения")
.pageVacancy
	div
		.row.g-2(v-if="response.length" )
			.col-12.col-md-6(v-for="res in response")
				.blockCard.cursor-p.hoverBorder
					.size-14.color-green(v-if="res.inviteLetter" @click="$_response_index_opeModalInfo(res.inviteLetter)") Приглашение
						span.color-violet.ms-3 Просмотреть сопроводительный текст
					.size-14.color-grey(@click="$_response_index_opeModalInfo(res.coverLetter)" v-else) Отклик
						span.color-violet.ms-3 Просмотреть сопроводительный текст
					//.titleCard {{summary.specialisation}}
					//.mt-2.mb-3.size-15.color-grey {{summary.city}}
					.d-flex.align-center.gap-10.mt-4
						router-link.btn.flex-grow-1(:to="`/vacancy/${res.vacancyId}`" @click="$event.stopPropagation()")
							img(src="/images/btn/company.svg")
							| Вакансия
						router-link.btn.flex-grow-1(:to="`/summary/${res.resumeId}`" @click="$event.stopPropagation()")
							img(src="/images/btn/document.svg")
							| Резюме
		.w-100.text-center.mt-5(v-else) Нет откликов или приглашений, отправьте свой отклик
			router-link.btn.mt-3(to="/vacancy")
				img(src="/images/btn/add.svg")
				| Просмотр вакансий
v-dialog(transition='dialog-top-transition' width='auto' v-model="modalInfo" )
	v-card
		v-toolbar(color="violet" title='Текст сообщения')
		v-card-text
			.form-group
				p.size-14(v-html="info" )
			.d-flex.gap-10.justify-center.mt-3
				button.btn(@click="modalInfo=false")
					img(src="/images/btn/close.svg")
					| Закрыть

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
				response: [],
				// модалка приглашения
				modalInfo: false,
				info: ''
			}
		},
		created() {
			this.$_response_index_getResponseAll()
			if(this.$store.getters.getUserPost !== 'ROLE_CANDIDAT') {
				this.$router.replace('/vacancy')
			}
		},
		methods: {
			async $_response_index_getResponseAll(){
				const res = await this.$store.getters.request('GET', 'reaction/all/user/' + this.$store.getters.getUserId)
				if(res&&!res.error_description){
					this.response = res
				}
			},
			$_response_index_opeModalInfo(info){
				this.info = info
				this.modalInfo = true
			}
		},

	}
</script>

<style scoped lang="scss">
	.status{
		margin: 15px 0;
	}
</style>
