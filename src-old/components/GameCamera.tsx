import { GameComponent } from '@/lib/GameComponent'
import { Moveable } from './Moveable'
import { GameRender } from './GameScreen'
import { InjectionKey } from '@/lib/ComponentNode'
import { Cords } from '@/types'
import { Ref, ref } from '@vue/reactivity'

export const GameCameraCords: InjectionKey<Cords> = Symbol('GameCameraCords')
export const GameCameraZoom: InjectionKey<Ref<number>> =
	Symbol('GameCameraZoom')

export class GameCamera extends GameComponent {
	cords: Cords = { x: 0, y: 0 }
	zoom = ref(0.35)

	setup() {
		const { node } = this

		node.provide(GameCameraCords, this.cords)
		node.provide(GameCameraZoom, this.zoom)

		node.on('wheel', e => {
			this.zoom.value += -e.deltaY / 1000
		})
	}

	draw() {
		const render = this.node.inject(GameRender)

		render.translate(-this.cords.x, -this.cords.y)
		render.scale(this.zoom.value, this.zoom.value)
	}

	tree() {
		return <Moveable cords={this.cords}>{this.props.children}</Moveable>
	}
}
