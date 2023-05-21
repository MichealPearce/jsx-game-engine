import { GameComponent } from '@/lib/GameComponent'
import { Cords, Size } from '@/types'
import { GameRender } from './GameScreen'
import { Ref } from '@vue/reactivity'

export interface GameImageSlice {
	x: number
	y: number
	width: number
	height: number
}

export class GameImage extends GameComponent<{
	image: Ref<HTMLImageElement>
	cords: Cords
	size?: Size
	slice?: GameImageSlice
}> {
	loading: Promise<void> | null = null

	get image() {
		return this.props.image.value
	}

	get size() {
		if (this.props.size) return this.props.size
		return { width: this.image.width, height: this.image.height }
	}

	get slice() {
		if (this.props.slice) return this.props.slice
		return {
			x: 0,
			y: 0,
			width: this.image.width,
			height: this.image.height,
		}
	}

	draw() {
		const render = this.node.inject(GameRender)
		const {
			size,
			slice,
			props: { cords },
		} = this

		render.drawImage(
			this.image,
			slice.x,
			slice.y,
			slice.width,
			slice.height,
			cords.x,
			cords.y,
			size.width,
			size.height,
		)
	}
}
