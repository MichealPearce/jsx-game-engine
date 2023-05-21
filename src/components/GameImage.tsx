import { Size } from '@/types'
import { Ref, computed, reactive } from '@vue/reactivity'
import { GameRenderer } from './GameCanvas'
import { Cords } from '@/lib/cords'
import { useNode } from '@/lib/functions'

export interface GameImageSlice {
	x: number
	y: number
	width: number
	height: number
}

export interface GameImageProps {
	image: Ref<HTMLImageElement>
	cords: Cords
	size?: Size
	slice?: GameImageSlice
}

export function GameImage({
	image,
	cords,
	size = reactive({
		width: computed(() => image.value.width),
		height: computed(() => image.value.height),
	}),
	slice = reactive({
		x: 0,
		y: 0,
		width: computed(() => image.value.width),
		height: computed(() => image.value.height),
	}),
}: GameImageProps) {
	const node = useNode()
	const render = node.requireInject(GameRenderer)

	node.on('draw', next => {
		render.drawImage(
			image.value,
			slice.x,
			slice.y,
			slice.width,
			slice.height,
			cords.x,
			cords.y,
			size.width,
			size.height,
		)

		next()
	})
}
