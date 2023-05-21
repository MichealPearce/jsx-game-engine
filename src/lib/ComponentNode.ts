import { isArray, noop } from '@michealpearce/utils'
import { getCurrentInstance, setCurrentInstance } from './functions'
import { GameEvents, InjectionKey } from '@/types'

export type Listener<Params extends any[] = any> = (
	next: () => void,
	...params: Params
) => void

type ListenerMap = Map<keyof GameEvents, Set<Listener>>

const ComponentNodeSymbol = Symbol('ComponentNode')

export class ComponentNode {
	readonly [ComponentNodeSymbol] = true

	public parent: ComponentNode | null = null
	public tree: ComponentNode[] | null = null
	public readonly context = new Map()
	public readonly listeners: ListenerMap = new Map()

	constructor(
		public readonly func: Function,
		public readonly props: Record<string, any>,
		public readonly children: unknown[],
	) {}

	provide<Value, Key extends InjectionKey<Value>>(key: Key, value: Value) {
		this.context.set(key, value)
	}

	inject<Value, Key extends InjectionKey<Value>>(key: Key): Value | undefined
	inject<Value, Key extends InjectionKey<Value>>(
		key: Key,
		fallback: Value,
	): Value
	inject<Value, Key extends InjectionKey<Value>>(
		key: Key,
		fallback?: Value,
	): Value | undefined {
		if (!this.parent) {
			if (fallback) return fallback

			console.warn(
				`Could not inject ${key.description} because no parent component was found.`,
			)
			return
		}

		const traverse = (node: ComponentNode): Value | undefined => {
			if (node.context.has(key)) return node.context.get(key)
			else if (node.parent) return traverse(node.parent)
			else if (fallback) return fallback

			console.warn(`${key.toString()} is not provided to ${this.func.name}`)
		}

		return traverse(this.parent)
	}

	requireInject<V>(key: InjectionKey<V>): V {
		const provided = this.inject(key, undefined)
		if (provided === undefined)
			throw new Error(`No provider for ${key.toString()}`)
		return provided
	}

	on<Event extends keyof GameEvents>(
		event: Event,
		listener: Listener<Parameters<GameEvents[Event]>>,
	) {
		if (!this.listeners.has(event)) this.listeners.set(event, new Set())
		const listeners = this.listeners.get(event)!

		listeners.add(listener)
		return () => listeners.delete(listener)
	}

	emit<Event extends keyof GameEvents>(
		event: Event,
		...params: Parameters<GameEvents[Event]>
	) {
		/**
		 * 1. Get all listeners for the type
		 * 2. Reverse the array so that the first listener is the last to be called
		 * 3. Call each listener with the next function
		 */

		const listeners = Array.from(this.listeners.get(event) ?? [])

		const loop = () => {
			const listener = listeners.shift()

			if (listener) listener(loop, ...params)
			else if (this.tree)
				for (const node of this.tree.flat(Infinity)) node.emit(event, ...params)
		}

		loop()
	}

	public async setup(parent: ComponentNode | null = null): Promise<void> {
		this.parent = parent
		this.context.clear()

		const previousInstance = getCurrentInstance()
		setCurrentInstance(this)

		const result = await this.func(this.props)
		setCurrentInstance(previousInstance)

		if (!result) this.tree = this.children as any
		else if (isArray(result)) this.tree = result
		else this.tree = [result]

		if (this.tree) {
			const calls = this.tree.flat(Infinity).map(node => node.setup(this))
			return Promise.all(calls).then(noop)
		}
	}

	public async loop(fps = 60) {
		await this.setup()

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
				this.emit('tick', delta)
				lag -= frameDuration
			}

			const lagOffset = lag / frameDuration
			this.emit('draw', lagOffset)
		}

		loop()
		return () => (running = false)
	}
}

export function isComponentNode(value: any): value is ComponentNode {
	return value && value[ComponentNodeSymbol]
}
