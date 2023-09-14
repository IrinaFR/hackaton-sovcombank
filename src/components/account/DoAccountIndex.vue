<template lang="pug">
DoUiSubHeader(title="Мой профиль")
.blockContent
	.titleBlock Информация
	.form-group
		.size-14.color-grey.mb-1 Имя
		.bold {{user.firstname}}
	.form-group
		.size-14.color-grey.mb-1 Фамилия
		.bold {{user.lastName}}
	.form-group
		.size-14.color-grey.mb-1 Логин
		.bold {{user.username}}

</template>

<script>

	export default {
		data(){
			return{
				user: {},
			}
		},
		created() {
			this.$_account_index_loadInfo()
		},
		methods: {
			async $_account_index_loadInfo(){
				const res = await this.$store.getters.request('GET', 'users/info/' + this.$store.getters.getUserName)
				if(res&&!res.error_description){
					this.user = res
				}
			},
		}
	}
</script>
