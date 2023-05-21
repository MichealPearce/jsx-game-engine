import { GameComponent } from '@/lib/GameComponent'
import { MovementDirections, MovementMomentum } from '@/types'

export class Moveable extends GameComponent<{
	cords: { x: number; y: number }

	momentum?: MovementMomentum
	directions?: MovementDirections

	keys?: {
		up: string
		down: string
		left: string
		right: string
	}

	options?: {
		speed?: number
		maxSpeed?: number
	}
}> {
	momentum = this.props.momentum ?? { x: 0, y: 0 }
	directions = this.props.directions ?? {
		up: false,
		down: false,
		left: false,
		right: false,
	}

	get options() {
		return this.props.options || {}
	}

	get speed() {
		return this.options.speed || 0.5
	}

	get maxSpeed() {
		return this.options.maxSpeed || 5
	}

	get keys() {
		return (
			this.props.keys || {
				up: 'ArrowUp',
				down: 'ArrowDown',
				left: 'ArrowLeft',
				right: 'ArrowRight',
			}
		)
	}

	setup() {
		this.node.on('keydown', ({ key }) => this.setMovement(key, true))
		this.node.on('keyup', ({ key }) => this.setMovement(key, false))
	}

	tick() {
		const {
			momentum,
			directions,
			speed,
			maxSpeed,
			props: { cords },
		} = this

		// calculates momentum based on directions. Momentum is capped at maxSpeed and
		// if no direction is pressed momentum is reduced by speed until less than speed
		// where it is set to 0
		if (directions.up) momentum.y -= speed
		if (directions.down) momentum.y += speed
		if (directions.left) momentum.x -= speed
		if (directions.right) momentum.x += speed

		if (momentum.x > maxSpeed) momentum.x = maxSpeed
		if (momentum.x < -maxSpeed) momentum.x = -maxSpeed
		if (momentum.y > maxSpeed) momentum.y = maxSpeed
		if (momentum.y < -maxSpeed) momentum.y = -maxSpeed

		if (!directions.up && !directions.down) {
			if (momentum.y > 0) momentum.y -= speed
			if (momentum.y < 0) momentum.y += speed
		}

		if (!directions.left && !directions.right) {
			if (momentum.x > 0) momentum.x -= speed
			if (momentum.x < 0) momentum.x += speed
		}

		// if (momentum.x < speed && momentum.x > -speed) momentum.x = 0
		// if (momentum.y < speed && momentum.y > -speed) momentum.y = 0

		cords.x += momentum.x
		cords.y += momentum.y
	}

	setMovement(key: string, value: boolean) {
		const { keys } = this

		if (key === keys.up) this.directions.up = value
		else if (key === keys.down) this.directions.down = value
		else if (key === keys.left) this.directions.left = value
		else if (key === keys.right) this.directions.right = value
	}
}
