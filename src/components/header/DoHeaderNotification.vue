<template lang="pug">
v-menu(v-model='showMenu')
	template(v-slot:activator='{ props }')
		v-badge.mx-2.position-relative(color='red' dot :bordered='true')
			.iconNotification(v-bind='props')
				img(src='/images/header/notification.svg')
	v-card.overviewTab(variant='flat')
		span.p-3 Функция уведомления пока недоступна

</template>

<script>
	export default {
		data(){
			return{
				activeNotif: true,
				showMenu: false,
			}
		}
	}
</script>

<style scoped lang="scss">
.iconNotification{
  padding: 0 25px;
  border-left: solid 1px rgba(var(--v-theme-border), 1);
  border-right: solid 1px rgba(var(--v-theme-border), 1);
}
</style>
