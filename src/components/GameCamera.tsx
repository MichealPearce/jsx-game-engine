import { useNode } from '@/lib/functions'
import { reactive, ref } from '@vue/reactivity'
import { GameRenderer } from './GameCanvas'
import { Moveable } from './Moveable'
import { injectCords } from '@/lib/cords'

export function GameCamera() {
	const node = useNode()
	const render = node.requireInject(GameRenderer)

	const zoom = ref(0.9)
	const cords = reactive({ x: -60, y: 0 })
	const parentCords = injectCords({ x: 0, y: 0 })

	node.on('wheel', (next, e) => {
		if (e.deltaY > 0) zoom.value -= 0.1
		else zoom.value += 0.1

		next()
	})

	node.on('draw', next => {
		render.save()

		render.translate(-cords.x, -cords.y)
		render.scale(zoom.value, zoom.value)

		next()

		render.restore()
	})

	return [<Moveable cords={cords} />, node.children]
}
