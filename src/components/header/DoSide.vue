<template lang="pug">
v-navigation-drawer(v-model='localDrawer' :rail='rail' width='240' @update:modelValue="$emit('toggle')")
	v-list.listLinks( density="compact" nav)
		router-link.link(:to="link.url" v-for='link in menu' :class="{hidden:rail}")
			img.icon(:src="`/images/sidebar/${link.icon}`")
			.name {{link.title}}
			.active
				img(src="/images/sidebar/active.svg")
</template>

<script>
	export default {
		props: {
			rail: Boolean,
			drawer: Boolean
		},
		data(){
			return {
				localDrawer: this.drawer,
				menu: []
			}
		},
		created() {
			this.$_side_setLinks()
		},
		watch: {
			drawer(){
				this.localDrawer = this.drawer
			}
		},
		methods: {
			$_side_setLinks(){
				switch (this.$store.getters.getUserPost){
					case 'ROLE_ADMIN': {
						this.menu = [
							// { title: 'Заметки', icon: 'document.svg', url: '/notes'},
							{ title: 'Сотрудники', icon: 'employers.svg', url: '/'},
							{ title: 'Настройки', icon: 'settings.svg', url: '/settings'},
						]
						break
					}
					case 'ROLE_INITIATOR': {
						this.menu = [
							// { title: 'Заметки', icon: 'document.svg', url: '/notes'},
							// { title: 'Календарь', icon: 'calendar.svg', url: '/calendar'},
							{ title: 'Заявки', icon: 'card.svg', url: '/vacancy'},
						]
						break
					}
					case 'ROLE_RECRUTER': {
						this.menu = [
							// { title: 'Заметки', icon: 'document.svg', url: '/notes'},
							// { title: 'Календарь', icon: 'calendar.svg', url: '/calendar'},
							{ title: 'Резюме', icon: 'addMan.svg', url: '/summary'},
							{ title: 'Заявки', icon: 'card.svg', url: '/vacancy'},
						]
						break
					}
					case 'ROLE_CANDIDAT': {
						this.menu = [
							// { title: 'Заметки', icon: 'document.svg', url: '/notes'},
							{ title: 'Отклики', icon: 'company.svg', url: '/response'},
							{ title: 'Резюме', icon: 'addMan.svg', url: '/summary'},
							{ title: 'Вакансии', icon: 'card.svg', url: '/vacancy'},
						]
						break
					}
				}
			}
		}
	}
</script>

<style scoped lang="scss">
.listLinks{
  margin-top: 70px;
}
.listLinks .link{
  display: flex;
  align-items: center;
  height: 48px;
  padding: 15px;
  column-gap: 15px;
  border-top-right-radius: 50px;
  border-bottom-right-radius: 50px;
  margin-left: -8px;
  margin-bottom: 20px;
  margin-right: -8px;
  padding-left: 18px;
  &.hidden,
  &.router-link-active.router-link-exact-active.hidden{
    .name{
      opacity: 0;
    }
    .active{
      opacity: 0;
    }
  }
  &.router-link-active.router-link-exact-active{
    background: rgba(var(--v-theme-violet-bg), 1);
    .icon{
      filter: none;
    }
    .name{
      font-size: 15px;
      font-weight: 500;
      color: rgba(var(--v-theme-violet), 1);
      flex-grow: 1;
      opacity: 1;
      transition: opacity .3s ease;
    }
    .active{
      display: flex;
      opacity: 1;
      transition: opacity .3s ease;
    }
  }
  .icon{
    filter: grayscale(1) invert(1) brightness(1);
  }
  .name{
    font-size: 15px;
    font-weight: 600;
    color: rgba(var(--v-theme-grey), 1);
    flex-grow: 1;
  }
  .active{
    display: none;
    justify-content: center;
    align-items: center;
    background: rgba(var(--v-theme-white), 1);
    height: 32px;
    width: 32px;
    min-width: 32px;
    border-radius: 50%;
  }
}
</style>
