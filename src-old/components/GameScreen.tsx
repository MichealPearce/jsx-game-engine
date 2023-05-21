import { InjectionKey } from '@/lib/ComponentNode'
import { GameComponent } from '@/lib/GameComponent'
import { GameCamera } from './GameCamera'
import { ref } from '@vue/reactivity'

export const GameRender: InjectionKey<CanvasRenderingContext2D> =
	Symbol('GameRender')

export class GameScreen extends GameComponent<{
	canvas: HTMLCanvasElement
}> {
	tickStart = ref(0)
	tickDelta = ref(0)

	setup() {
		const {
			node,
			props: { canvas },
		} = this

		const render = canvas.getContext('2d')
		if (!render) throw new Error('Canvas render context not found')

		canvas.tabIndex = 0
		node.provide(GameRender, render)

		// setup listeners
		;[
			'keydown',
			'keyup',
			'mousedown',
			'mouseup',
			'mousemove',
			'click',
			'dblclick',
			'wheel',
		].forEach(type => this.setupListener(type))
	}

	draw() {
		const render = this.node.inject(GameRender)

		render.canvas.width = render.canvas.clientWidth
		render.canvas.height = render.canvas.clientHeight

		render.fillStyle = 'black'
		render.fillRect(0, 0, render.canvas.width, render.canvas.height)
	}

	tree() {
		return <GameCamera>{this.props.children}</GameCamera>
	}

	protected setupListener(type: string) {
		const {
			node,
			props: { canvas },
		} = this

		canvas.addEventListener(type, e => node.emit(type as any, e))
	}
}
