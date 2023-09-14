import 'vuetify/dist/vuetify.css'
import {light, dark} from "./theme";

/* eslint-disable-next-line */
import { createVuetify } from 'vuetify/dist/vuetify'

const vuetify = createVuetify({
	theme: {
		defaultTheme: 'light',
		themes: {
			light, dark
		}
	},
})
export default vuetify
