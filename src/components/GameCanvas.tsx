import { InjectionKey } from '@/types'
import { useNode } from '@/lib/functions'

export interface GameCanvasProps {
	canvas: HTMLCanvasElement
}

export const GameRenderer: InjectionKey<CanvasRenderingContext2D> =
	Symbol('CanvasContext')

export function GameCanvas({ canvas }: GameCanvasProps) {
	const node = useNode()
	const render = canvas.getContext('2d')!

	canvas.id = 'game'
	canvas.tabIndex = 0
	canvas.focus()

	setupListeners(canvas)

	node.provide(GameRenderer, render)
	node.on('draw', next => {
		render.canvas.width = render.canvas.clientWidth
		render.canvas.height = render.canvas.clientHeight

		next()
	})
}

function setupListeners(canvas: HTMLCanvasElement) {
	const node = useNode()

	;[
		'keydown',
		'keyup',
		'mousedown',
		'mouseup',
		'mousemove',
		'click',
		'dblclick',
		'wheel',
	].forEach(event => canvas.addEventListener(event, e => node.emit(event, e)))
}
