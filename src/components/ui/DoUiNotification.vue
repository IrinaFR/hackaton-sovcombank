<template lang="pug">
.contentNotifications
	transition-group(name="notification" tag="p")
		p.notification(v-for="(n,index) in $store.getters.getNotifications" :key="n.id" :class="n.type")
			img.icon(:src="'/images/notification/'+n.type+'.svg?new'" v-if="n.type")
			.text(v-html="n.text")
			img.del(src="/images/notification/close.svg" @click="$store.commit('addNotification',{del:index})")
</template>
<style scoped lang="scss">
	.basket{
		cursor: pointer;
		color: #5F5FFC;
	}
	.contentNotifications{
		position: fixed;
		bottom: 30px;
		left: 30px;
		z-index: 2100;
		background: none;
	}
	.notification {
		display: flex;
		justify-content: space-between;
		column-gap: 10px;
		position: relative;
		padding: 20px;
		background: rgb(var(--v-theme-white));
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
		border-radius: 12px;
		font-weight: 500;
		font-size: 14px;
		line-height: 22px;
		color: #333333;
		transition: .5s ease-in-out;
		transform: none;
		width: fit-content;
		height: fit-content;
		margin-top: 15px;
		.icon{
			min-width: 20px;
		}
		.del{
			min-width: 10px;
			margin-left: 10px;
		}
	}
	.notification-enter-active, .notification-leave-active {
		animation: bounce-in .5s ease-in-out;
		animation-fill-mode: forwards;
	}
	.notification-enter, .notification-leave-to {
		animation: bounce-of .3s ease-in-out;
		animation-fill-mode: forwards;
	}
	@keyframes bounce-in {
		0% {
			transform: translateX(-150%);
		}
		80% {
			transform: translateX(30px);
		}
		100% {
			transform: translateX(0);
		}
	}
	@keyframes bounce-of {
		0% {
			transform: translateX(0);
		}
		100% {
			transform: translateX(-150%);
		}
	}
	@media (max-width: 768px) {
		.contentNotifications{
			bottom: calc(15px + constant(safe-area-inset-bottom));
			bottom: calc(15px + env(safe-area-inset-bottom));
			top: auto;
			left: 0;
			width: 100%;
			padding: 0 15px;
		}
		.notification{
			width: 100%;
			font-size: 14px;
		}
		@keyframes bounce-in {
			0% {
				transform: translateY(150%);
			}
			80% {
				transform: translateY(-30px);
			}
			100% {
				transform: translateY(0);
			}
		}
		@keyframes bounce-of {
			0% {
				transform: translateY(0);
			}
			100% {
				transform: translateY(150%);
			}
		}
	}
</style>
