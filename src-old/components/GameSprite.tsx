import { GameComponent } from '@/lib/GameComponent'
import { SpriteSheet } from '@/lib/spritesheets'
import { GameImage } from './GameImage'
import { Ref, computed, reactive, ref } from '@vue/reactivity'
import { Cords } from '@/types'

export class GameSprite extends GameComponent<{
	spritesheet: Ref<SpriteSheet>
	fps?: number
	frames?: string[]
	cords: Cords
}> {
	readonly tickDelta = ref(0)
	readonly currentFrame = ref(0)
	readonly image = computed(() => this.spritesheet.image)

	readonly size = reactive({
		width: computed(() => this.slide.frame.w),
		height: computed(() => this.slide.frame.h),
	})

	readonly slice = reactive({
		x: computed(() => this.slide.frame.x),
		y: computed(() => this.slide.frame.y),
		width: computed(() => this.slide.frame.w),
		height: computed(() => this.slide.frame.h),
	})

	get spritesheet() {
		return this.props.spritesheet.value
	}

	get frames() {
		return (
			this.props.frames ??
			Object.keys(this.spritesheet.frames).sort((a, b) => {
				return a.localeCompare(b, undefined, {
					numeric: true,
					sensitivity: 'base',
				})
			})
		)
	}

	get fps() {
		return this.props.fps ?? this.frames.length
	}

	get slide() {
		const frameName = this.frames[this.currentFrame.value]
		return this.spritesheet.frames[frameName]
	}

	tick(delta: number): void {
		const { fps, tickDelta, currentFrame, frames } = this
		const interval = 1000 / fps

		tickDelta.value += delta

		if (tickDelta.value > interval) {
			tickDelta.value = 0

			currentFrame.value++
			if (currentFrame.value >= frames.length) {
				currentFrame.value = 0
			}
		}
	}

	tree() {
		const {
			image,
			size,
			slice,
			props: { cords },
		} = this

		return (
			<GameImage
				image={image}
				cords={cords}
				size={size}
				slice={slice}
			>
				{this.props.children}
			</GameImage>
		)
	}
}
