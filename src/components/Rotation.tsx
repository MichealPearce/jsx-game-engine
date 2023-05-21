import { Ref, computed, reactive } from '@vue/reactivity'
import { GameRenderer } from './GameCanvas'
import { Size } from '@/types'
import { Cords } from '@/lib/cords'
import { useNode } from '@/lib/functions'

export interface RotationProps {
	degree: Ref<number>
	size: Size
	cords: Cords
}

export function Rotation({ degree, size, cords }: RotationProps) {
	const node = useNode()
	const render = node.requireInject(GameRenderer)

	const centerOffsets = reactive({
		x: computed(() => {
			return cords.x + size.width / 2
		}),
		y: computed(() => {
			return cords.y + size.height / 2
		}),
	})

	node.on('draw', next => {
		render.save()

		render.translate(centerOffsets.x, centerOffsets.y)
		render.rotate((degree.value * Math.PI) / 180)
		render.translate(-centerOffsets.x, -centerOffsets.y)

		next()

		render.restore()
	})
}
