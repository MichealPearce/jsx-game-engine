import { SpriteSheet, SpriteSheetSlide } from '@/lib/spritesheets'
import { Ref, computed, reactive, ref } from '@vue/reactivity'
import { GameImage, GameImageSlice } from './GameImage'
import { Rotation } from './Rotation'
import { Cords } from '@/lib/cords'
import { Size } from '@/types'
import { Rectangle } from './Rectangle'
import { useNode } from '@/lib/functions'

export interface SpriteProps {
	spritesheet: Ref<SpriteSheet>
	cords: Cords
	fps?: Ref<number>
	frames?: Ref<string[]>
	rotation?: Ref<number>
	tickDelta?: Ref<number>
	currentFrame?: Ref<number>
	image?: Ref<HTMLImageElement>
	slide?: Ref<SpriteSheetSlide>
	size?: Size
	slice?: GameImageSlice
}

export function Sprite({
	spritesheet,
	cords,
	rotation = ref(0),
	frames = ref(
		Object.keys(spritesheet.value.frames).sort((a, b) => {
			return a.localeCompare(b, undefined, {
				numeric: true,
				sensitivity: 'base',
			})
		}),
	),
	fps = ref(frames.value.length),
	tickDelta = ref(0),
	currentFrame = ref(0),
	image = computed(() => spritesheet.value.image),
	slide = ref(spritesheet.value.frames[frames.value[currentFrame.value]]),
	size = reactive({
		width: computed(() => slide.value.frame.w),
		height: computed(() => slide.value.frame.h),
	}),
	slice = reactive({
		x: computed(() => slide.value.frame.x),
		y: computed(() => slide.value.frame.y),
		width: computed(() => slide.value.frame.w),
		height: computed(() => slide.value.frame.h),
	}),
}: SpriteProps) {
	const node = useNode()

	node.on('tick', (next, delta) => {
		const interval = 1000 / fps.value

		tickDelta.value += delta

		if (tickDelta.value > interval) {
			tickDelta.value = 0

			currentFrame.value++
			if (currentFrame.value >= frames.value.length) {
				currentFrame.value = 0
			}
		}

		next()
	})

	return (
		<Rotation
			degree={rotation}
			cords={cords}
			size={size}
		>
			<Rectangle
				color={ref('red')}
				cords={cords}
				size={size}
				mode={ref('stroke')}
			>
				<GameImage
					image={image}
					cords={cords}
					size={size}
					slice={slice}
				>
					{node.children}
				</GameImage>
			</Rectangle>
		</Rotation>
	)
}
