import { FunctionType, Rollable, isArray, roll } from '@michealpearce/utils'
import { GameComponent } from './GameComponent'
import { GameEvents } from '@/types'

export interface InjectionKey<T> extends Symbol {}

export class ComponentNode {
	public parent: ComponentNode | null = null
	public tree: ComponentNode[] | void = undefined
	protected readonly context = new Map()
	protected readonly events = new Map<keyof GameEvents, Set<FunctionType>>()

	constructor(public readonly component: GameComponent) {
		component.node = this
	}

	setup(): Rollable {
		return roll([
			() => this.component.setup?.(),
			() => this.render(),
			() => {
				if (!this.tree) return

				const funcs = this.tree.map(child => () => child.setup())
				return roll(funcs)
			},
		])
	}

	tick(delta: number) {
		this.component.tick?.(delta)

		if (!this.tree) return
		for (const child of this.tree) child.tick(delta)
	}

	draw(lagOffset: number) {
		this.component.draw?.(lagOffset)

		if (!this.tree) return
		for (const child of this.tree) child.draw(lagOffset)
	}

	render() {
		const tree = this.component.tree()

		if (tree) {
			if (isArray(tree)) this.tree = tree
			else this.tree = [tree]

			for (const branch of this.tree) branch.parent = this
		} else this.tree = undefined
	}

	inject<V, K extends string | InjectionKey<V>>(
		key: K,
	): K extends InjectionKey<infer R> ? R : V | undefined {
		return this.context.get(key) ?? this.parent?.inject(key)
	}

	provide<V, K extends string | InjectionKey<V>>(
		key: K,
		value: K extends InjectionKey<infer R> ? R : V,
	) {
		this.context.set(key, value)
	}

	on<EventName extends keyof GameEvents>(
		event: EventName,
		handler: GameEvents[EventName],
	) {
		if (!this.events.has(event)) this.events.set(event, new Set())
		const listeners = this.events.get(event)!

		listeners.add(handler)
		return () => listeners.delete(handler)
	}

	emit<EventName extends keyof GameEvents>(
		event: EventName,
		...args: Parameters<GameEvents[EventName]>
	) {
		if (this.events.has(event)) {
			const listeners = this.events.get(event)!
			for (const listener of listeners) listener(...args)
		}

		if (this.tree) for (const child of this.tree) child.emit(event, ...args)
	}

	loop(fps = 60) {
		const frameDuration = 1000 / fps
		let start = Date.now(),
			lag = 0,
			running = true

		const loop = () => {
			if (!running) return
			requestAnimationFrame(loop)

			const current = Date.now()
			const delta = current - start

			start = current
			lag += delta

			while (lag >= frameDuration) {
				this.tick(delta)
				lag -= frameDuration
			}

			const lagOffset = lag / frameDuration
			this.draw(lagOffset)
		}

		loop()
		return () => (running = false)
	}
}
