import { GameComponent } from '@/lib/GameComponent'

export class Gravity extends GameComponent<{
	cords: { x: number; y: number }
}> {
	tick() {
		const { cords } = this.props

		cords.y += 1
	}
}
