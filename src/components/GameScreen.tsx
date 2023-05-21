import { useNode } from '@/lib/functions'
import { GameRenderer } from './GameCanvas'
import { Size } from '@/types'
import { Cords, useCords } from '@/lib/cords'
import { Ref, ref } from '@vue/reactivity'

export interface GameScreenProps {
	fillStyle?: Ref<string>
	cords?: Cords
	size?: Size
}

export function GameScreen({
	fillStyle = ref('black'),
	cords: initCords,
	size,
}: GameScreenProps) {
	const node = useNode()
	const cords = useCords(initCords)

	const render = node.requireInject(GameRenderer)

	node.on('draw', next => {
		render.save()

		const { width, height } = size ?? {
			width: render.canvas.width,
			height: render.canvas.height,
		}

		render.beginPath()
		render.moveTo(cords.x, cords.y)
		render.lineTo(cords.x + width, cords.y)
		render.lineTo(cords.x + width, cords.y + height)
		render.lineTo(cords.x, cords.y + height)
		render.closePath()
		render.clip()

		render.resetTransform()
		render.fillStyle = fillStyle.value
		render.fillRect(cords.x, cords.y, width, height)

		next()

		render.restore()
	})
}
