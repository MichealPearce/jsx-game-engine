import { Cords, requireCords, useCords } from '@/lib/cords'
import { useNode } from '@/lib/functions'
import { MovementDirections, MovementMomentum } from '@/types'

export interface MoveableProps {
	cords: Cords
	directions?: MovementDirections
	momentum?: MovementMomentum
	speed?: {
		incriment: number
		max: number
	}
	keys?: {
		up: string
		down: string
		left: string
		right: string
	}
}

export function Moveable({
	cords,
	momentum = { x: 0, y: 0 },
	directions = {
		left: false,
		right: false,
		up: false,
		down: false,
	},
	speed = {
		incriment: 0.5,
		max: 5,
	},
	keys = {
		up: 'ArrowUp',
		down: 'ArrowDown',
		left: 'ArrowLeft',
		right: 'ArrowRight',
	},
}: MoveableProps) {
	const node = useNode()

	function setMovement(key: string, value: boolean) {
		if (key === keys.up) directions.up = value
		else if (key === keys.down) directions.down = value
		else if (key === keys.left) directions.left = value
		else if (key === keys.right) directions.right = value
	}

	node.on('keydown', (next, e) => {
		setMovement(e.key, true)
		next()
	})

	node.on('keyup', (next, e) => {
		setMovement(e.key, false)
		next()
	})

	node.on('tick', next => {
		// calculates momentum based on directions. Momentum is capped at maxSpeed and
		// if no direction is pressed momentum is reduced by speed until less than speed
		// where it is set to 0
		if (directions.up) momentum.y -= speed.incriment
		if (directions.down) momentum.y += speed.incriment
		if (directions.left) momentum.x -= speed.incriment
		if (directions.right) momentum.x += speed.incriment

		if (momentum.x > speed.max) momentum.x = speed.max
		if (momentum.x < -speed.max) momentum.x = -speed.max
		if (momentum.y > speed.max) momentum.y = speed.max
		if (momentum.y < -speed.max) momentum.y = -speed.max

		if (!directions.up && !directions.down) {
			if (momentum.y > 0) momentum.y -= speed.incriment
			if (momentum.y < 0) momentum.y += speed.incriment
		}

		if (!directions.left && !directions.right) {
			if (momentum.x > 0) momentum.x -= speed.incriment
			if (momentum.x < 0) momentum.x += speed.incriment
		}

		// if (momentum.x < speed && momentum.x > -speed) momentum.x = 0
		// if (momentum.y < speed && momentum.y > -speed) momentum.y = 0

		cords.x = cords.x + momentum.x
		cords.y = cords.y + momentum.y

		next()
	})
}
