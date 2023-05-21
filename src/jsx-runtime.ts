import { ComponentNode } from './lib/ComponentNode'

declare global {
	namespace JSX {
		// interface ElementAttributesProperty {
		// 	props: any // specify the property name to use
		// }
		// interface ElementChildrenAttribute {
		// 	children: {} // specify children name to use
		// }
	}
}

export const jsx = {
	component(func: any, props: any = {}, ...children: any[]) {
		if (!props) props = {}
		return new ComponentNode(func, props, children)
	},
}
