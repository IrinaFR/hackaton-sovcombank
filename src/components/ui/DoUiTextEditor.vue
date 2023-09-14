<template lang="pug">
vue-editor(:editorToolbar="customToolbar" v-model="content" :placeholder="placeholder" @text-change="$_text_editor_clearModalText")
</template>

<script>
	import {VueEditor} from "vue3-editor";
	export default {
		props: {
			value:{
				type: String
			},
			placeholder:{
				type: String
			},
			headerAllowed:{
				type: Boolean,
				default: false
			}
		},
		data(){
			return{
				content: this.value,
				customToolbar: [
					['bold', 'italic', 'underline', 'strike'],
					[{ 'list': 'ordered'}, { 'list': 'bullet' }],
					this.headerAllowed?[{ 'header': 1 }, { 'header': 2 }]:[]
				],
			}
		},
		components: {
			VueEditor,
		},
		watch:{
			'value'(){
				this.content=this.value
			}
		},
		methods:{
			$_text_editor_clearModalText(event){
				this.$emit('input', this.clearingTextFromTags(this.content,event))
			},
			clearingTextFromTags(text, inserted){
				inserted.ops.forEach(option=>{
					if(option.attributes){
						for(let prop in option.attributes) {
							//проверка атрибутов, не трогает если это связано с размером шрифта, его толщиной или выравниванием, но убирает все цвета и содержание href,scr,alt
							if(option.attributes[prop]!==null
								&&option.attributes[prop]!==false
								&&option.attributes[prop]!==true
								&&prop!=='align'
								&&typeof option.attributes[prop]!=="number") {
								text=text.replace(option.attributes[prop],'')
								text=text.replace(prop,'')
							}
						}
					}
				})
				return text.replace(/<(\/?)(img|script|iframe|pre)(\s(.|\n)*?>|>)/g, "")
				//отлавливает теги img, script, style, a , iframe и pre,
				// проверяет наличие открывающейся скобки и удаляет все до закрывающейся скобки
				// (в случае, если перед тегом есть'<' и  после тега идет пробел или'>')
			}
		}
	}
</script>

<style>
.ql-toolbar.ql-snow,
.ql-container.ql-snow{
	border: solid 1px rgb(var(--v-theme-border));
}
.ql-toolbar.ql-snow{
	border-top-left-radius: 10px;
	border-top-right-radius: 10px;
}
.ql-container.ql-snow{
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
