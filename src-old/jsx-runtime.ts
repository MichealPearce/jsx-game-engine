import { ComponentNode } from './lib/ComponentNode'

declare global {
	namespace JSX {
		interface ElementAttributesProperty {
			props: any // specify the property name to use
		}

		interface ElementChildrenAttribute {
			children: {} // specify children name to use
		}
	}
}

export const jsx = {
	component(Component: any, props: any = {}, ...children: any[]) {
		if (!props) props = {}
		props.children = children.flat(Infinity)

		const component = new Component(props)
		return new ComponentNode(component)
	},
}
