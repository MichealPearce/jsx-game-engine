export interface GameEvents {
	keydown(event: KeyboardEvent): void
	keyup(event: KeyboardEvent): void
	click(event: MouseEvent): void
	dblclick(event: MouseEvent): void
	mousemove(event: MouseEvent): void
	mouseup(event: MouseEvent): void
	mousedown(event: MouseEvent): void
	wheel(event: WheelEvent): void
	tick(delta: number): void
}

export interface Cords {
	x: number
	y: number
}

export interface Size {
	width: number
	height: number
}

export interface MovementDirections {
	up: boolean
	down: boolean
	left: boolean
	right: boolean
}

export interface MovementMomentum {
	x: number
	y: number
}
