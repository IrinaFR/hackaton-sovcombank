<template lang="pug">
v-app(:theme="theme" v-cloak)
	DoSide(:rail="rail" :drawer="drawer" @toggle="$_index_toggleNavigate")
	DoHeader(:rail="rail" @change="$_index_toggleNavigate" @theme="$_index_changeTheme")
	v-main
		#main
			router-view
</template>

<script>
	import DoHeader from "@/components/header/DoHeader.vue";
	import DoSide from "@/components/header/DoSide.vue";
	import DoUiNotification from "@/components/ui/DoUiNotification.vue";
	export default {
		components: {
			DoHeader, DoSide, DoUiNotification
		},
		data(){
			return{
				theme: 'light',
				drawer: this.$root.getWidth() <= 1280 ? false : true,
				rail: true,
			}
		},
		methods: {
			async create(){

			},
			$_index_toggleNavigate(value){
				if(this.$root.getWidth() <= 1280){
					this.rail = false
					if(this.drawer===value) this.drawer  =!value
						else this.drawer = value
				} else {
					this.drawer = true
					if(this.rail===value) this.rail  =!value
					else this.rail = value
				}
			},
			$_index_changeTheme(){
				if(this.theme==='light') this.theme = 'dark'
					else this.theme = 'light'
				localStorage.setItem('theme', JSON.stringify(this.theme))
			}
		},
		created() {
			if(localStorage.theme){
				this.theme = JSON.parse(localStorage.getItem('theme'))
			} else{
				localStorage.setItem('theme', JSON.stringify(this.theme))
			}
			if(localStorage.getItem('rail')){
				this.rail = JSON.parse(localStorage.getItem('rail'))
			}
		}
	}
</script>

<style scoped lang="scss">
#main{
	padding: 40px 20px;
}
</style>
