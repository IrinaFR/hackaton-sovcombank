<template lang="pug">
v-menu(v-model='menu' :close-on-content-click='false' location='bottom')
	template(v-slot:activator='{ props }')
		v-list(v-bind='props')
			.profileHeader
				.profileHeaderInfo
					.medium.size-17 {{$store.getters.getUserName}}
					.size-15.color-grey {{$store.getters.getUserPostName}}
				img.profileHeaderImg(src="/images/avatars/1.jpg")
	v-card(min-width='300' rounded)
		v-list
		v-list(density='compact')
			v-list-item(density='compact' :title='$store.getters.getUserName' disabled="true" )
				span.color-grey.size-13 {{$store.getters.getUserPostName}}
			v-list-item(density='compact' to='/account' title='Мой профиль')
			v-list-item.cursor-p(density='compact' title='Сменить тему' @click="$emit('theme')")
		v-divider
		v-list(density='compact')
			v-list-item(density='compact' title='Выход' @click="$store.dispatch('exitAuth')")
</template>

<script>
	export default {
		emits: ['theme'],
		data(){
			return{
				menu: false
			}
		}
	}
</script>

<style scoped lang="scss">
.profileHeader{
  display: flex;
  column-gap: 20px;
  margin-left: 30px;
  @media(max-width: 576px){
    margin-left: 0;
  }
  &Info{
    max-width: 150px;
    @media(max-width: 576px){
      display: none;
    }
    & :nth-child(1n){
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-word;
    }
  }
  &Img{
    width: 40px;
    min-width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: solid 1px rgb(var(--v-theme-border))
  }
}
</style>
