import { InjectionKey } from '@/types'
import { useNode } from './functions'
import { computed, reactive } from '@vue/reactivity'

export interface Cords {
	x: number
	y: number
	translated?: {
		x: number
		y: number
	}
}

export const CordsInject: InjectionKey<Cords> = Symbol('Cords')

export function provideCords(cords: Cords, node = useNode()) {
	node.provide(CordsInject, cords)
}

export function useCords(cords = reactive({ x: 0, y: 0 }), node = useNode()) {
	const provided = injectCords({ x: 0, y: 0, translated: { x: 0, y: 0 } })
	const state = reactive({
		x: computed({
			get: () => cords.x,
			set: (value: number) => {
				cords.x = value
			},
		}),
		y: computed({
			get: () => cords.y,
			set: (value: number) => {
				cords.y = value
			},
		}),
		translated: {
			x: computed(() => {
				return cords.x + (provided.translated?.x || 0)
			}),
			y: computed(() => cords.y + (provided.translated?.y || 0)),
		},
	})

	provideCords(state, node)
	return state
}

export function injectCords(): Cords | undefined
export function injectCords(fallback: Cords): Cords
export function injectCords(fallback?: Cords, node = useNode()) {
	return node.inject(CordsInject, fallback)
}

export function requireCords(node = useNode()): Cords {
	return node.requireInject(CordsInject)
}
