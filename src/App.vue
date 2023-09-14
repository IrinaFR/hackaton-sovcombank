<template lang="pug">
DoUiNotification
router-view
</template>


<script>

	import DoUiNotification from "@/components/ui/DoUiNotification.vue";
	import store from "@/config/store/store";
	export default {
		components: {
			DoUiNotification
		},
		data(){
			return {
				width: 0,
				displayPriority: 0,
			}
		},
		created() {
			this.$_main_displayPriority()
		},
		mounted() {

			this.$_main_updateWidth();
			window.addEventListener('resize', this.$_main_updateWidth);
		},
		methods: {
			$_main_updateWidth() {
				this.width = window.innerWidth
			},
			getWidth(){
				return this.width
			},
			$_main_displayPriority(){
				const step = () => {
					requestAnimationFrame(async () => {
						this.displayPriority++
						if (this.displayPriority < 5) {
							if (this.displayPriority === 1) {
								if(localStorage.token&&localStorage.user){
									const token = {token: JSON.parse( localStorage.getItem('token'))}
									const user = JSON.parse(localStorage.getItem('user'))
									const res = Object.assign({}, token, user)
									await store.commit('userAuth', res);
								}
							}
							step();
						}
					})
				}
				step()
			}

		},
	}
</script>
