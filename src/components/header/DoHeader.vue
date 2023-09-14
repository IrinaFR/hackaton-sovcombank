<template lang="pug">
v-app-bar.mainHeader(:height="height" flat class="headerMain")
	template(v-slot:prepend )
		.prependHeader(@click="$_header_toggle")
			img(src="/images/header/toggle.svg")
	.mainTitle Цифровой офис
	template(v-slot:append)
		.d-flex.justify-lg-space-between.align-center
			DoHeaderNotification
			DoHeaderProfile(@theme="$emit('theme')")
</template>

<script>
	import DoHeaderNotification from './DoHeaderNotification'
	import DoHeaderProfile from './DoHeaderProfile'
	export default {
		components: { DoHeaderNotification, DoHeaderProfile},
		emits: ['change', 'theme'],
		props: {
			rail: Boolean
		},
		data(){
			return {
				height: 67,
				menu: false
			}
		},
		methods: {
			$_header_toggle(){
				this.$emit('change', !this.rail)
			},
		},
	}
</script>

<style scoped lang="scss">
  .mainTitle{
    font-weight: 700;
    font-size: 23px;
    color: rgba(var(--v-theme-text-main), 1);
    @media(max-width: 576px){
      font-size: 14px;
    }
  }
  .prependHeader{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 32px;
    background: linear-gradient(270.49deg, rgba(151, 71, 255, 0) 0.41%, rgba(151, 71, 255, 0) 48.44%, rgba(151, 71, 255, 0) 99.58%);;
    transition: background .4s ease;
    @media(max-width: 576px){
      padding: 0 30px 0 15px;
    }
  }
  .prependHeader:hover{
    background: linear-gradient(270.49deg, rgba(151, 71, 255, 0) 0.41%, rgba(151, 71, 255, 0.17) 48.44%, rgba(151, 71, 255, 0) 99.58%);
  }
</style>
