<template lang="pug">
v-app-bar.subHeader(height="76" flat )
    template(v-slot:prepend )
        .subTitle {{title}}
    template(v-slot:append)
        .appendSubHeader
            slot
.back(@click="$router.go(-1)" v-if="back" ) {{'<-- Назад'}}
</template>

<script>
	export default {
		props: {
			back: {
				type: Boolean,
				default: false
			},
			title: String
		},
		data(){
			return{
				height: 67
			}
		}
	}
</script>

<style scoped lang="scss">
.subTitle{
  font-weight: 700;
  font-size: 21px;
}
.appendSubHeader{
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 10px;
}
.back{
	font-size: 18px;
	margin-bottom: 40px;
	font-weight: bold;
}
@media(max-width: 576px){
	.subTitle{
		font-size: 14px;
	}
	.appendSubHeader .btn{
		width: 100%;
	}
}
</style>
