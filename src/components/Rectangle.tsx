import { Size } from '@/types'
import { GameRenderer } from './GameCanvas'
import { Ref, ref } from '@vue/reactivity'
import { Cords, useCords } from '@/lib/cords'
import { useNode } from '@/lib/functions'

export interface RectangleProps {
	color: Ref<string>
	cords: Cords
	size: Size
	mode?: Ref<'fill' | 'stroke'>
}

export function Rectangle({
	color,
	cords: initCords,
	size,
	mode = ref('fill'),
}: RectangleProps) {
	const node = useNode()
	const cords = useCords(initCords)

	const ctx = node.requireInject(GameRenderer)

	node.on('draw', next => {
		if (mode.value === 'fill') {
			ctx.fillStyle = color.value
			ctx.fillRect(
				cords.translated.x,
				cords.translated.y,
				size.width,
				size.height,
			)
		} else {
			ctx.strokeStyle = color.value
			ctx.strokeRect(
				cords.translated.x,
				cords.translated.y,
				size.width,
				size.height,
			)
		}

		ctx.fillStyle = 'black'
		ctx.fillText(
			`${cords.x}, ${cords.y}, ${cords.translated.x}, ${cords.translated.y}`,
			cords.translated.x,
			cords.translated.y + 10,
		)

		next()
	})
}
