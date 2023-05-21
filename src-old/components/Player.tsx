import { GameComponent } from '@/lib/GameComponent'
import { Moveable } from './Moveable'
import { computed, reactive, ref } from '@vue/reactivity'
import { SpriteSheet, getSpriteSheet } from '@/lib/spritesheets'
import { GameSprite } from './GameSprite'
import { MovementMomentum } from '@/types'

export class Player extends GameComponent {
	readonly cords = reactive({ x: 10, y: 10 })
	readonly slice = reactive({
		x: computed(() => this.cords.x),
		y: computed(() => this.cords.y),
		width: 200,
		height: 200,
	})

	readonly currentSpritesheet = ref('flashlightIdle')
	readonly spritesheets: {
		[name: string]: SpriteSheet
	} = reactive({})

	readonly momentum: MovementMomentum = reactive({
		x: 0,
		y: 0,
	})

	get isMoving() {
		return Object.values(this.momentum).some(v => v !== 0)
	}

	async setup() {
		this.spritesheets.flashlightIdle = await getSpriteSheet(
			'player.flashlight.idle',
		)

		this.spritesheets.flashlightMove = await getSpriteSheet(
			'player.flashlight.move',
		)
	}

	tree() {
		const spritesheet = computed(
			() => this.spritesheets[this.currentSpritesheet.value],
		)

		return (
			<Moveable
				cords={this.cords}
				momentum={this.momentum}
				keys={{
					up: 'w',
					down: 's',
					left: 'a',
					right: 'd',
				}}
				options={{
					speed: 1,
					maxSpeed: 15,
				}}
			>
				<GameSprite
					spritesheet={spritesheet}
					cords={this.cords}
					fps={40}
				/>
			</Moveable>
		)
	}
}
