import { Rollable } from '@michealpearce/utils'
import { ComponentNode } from './ComponentNode'

type BaseProps = Record<string, any>

export abstract class GameComponent<Props extends BaseProps = BaseProps> {
	public node!: ComponentNode

	constructor(
		public readonly props: Props & {
			children?: ComponentNode | ComponentNode[]
		},
	) {}

	setup?(): Rollable
	tick?(delta: number): void
	draw?(lagOffset: number): void

	tree(): ComponentNode | ComponentNode[] | void {
		return this.props.children
	}
}
