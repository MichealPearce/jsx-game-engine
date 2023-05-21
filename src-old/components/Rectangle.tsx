import { GameComponent } from '@/lib/GameComponent'
import { GameRender } from './GameScreen'

export class Rectangle extends GameComponent<{
	cords: { x: number; y: number }
	size: { width: number; height: number }
}> {
	draw() {
		const render = this.node.inject(GameRender)

		const { cords, size } = this.props

		render.fillStyle = 'white'
		render.fillRect(cords.x, cords.y, size.width, size.height)
	}
}
