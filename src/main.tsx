import { reactive, ref } from '@vue/reactivity'
import { GameCanvas } from './components/GameCanvas'
import { GameScreen } from './components/GameScreen'
import { Rectangle } from './components/Rectangle'
import { ComponentNode } from './lib/ComponentNode'
import { Moveable } from './components/Moveable'
import { useCords } from './lib/cords'
import { GameCamera } from './components/GameCamera'

interface PlayerProps {
	keys?: {
		up: string
		down: string
		left: string
		right: string
	}
}

function Player({ keys }: PlayerProps) {
	const cords = reactive({ x: 0, y: 0 })

	return (
		<Moveable
			cords={cords}
			keys={keys}
		>
			<Rectangle
				cords={cords}
				size={{ width: 100, height: 100 }}
				color={ref('blue')}
			/>
		</Moveable>
	)
}

const canvas = document.createElement('canvas')
const game: ComponentNode = (
	<GameCanvas canvas={canvas}>
		<GameScreen
			fillStyle={ref('green')}
			size={{ width: 600, height: 720 }}
			cords={{ x: 0, y: 0 }}
		>
			<GameCamera>
				<Player
					keys={{
						up: 'w',
						down: 's',
						left: 'a',
						right: 'd',
					}}
				/>

				<Rectangle
					cords={{ x: 100, y: 100 }}
					size={{ width: 100, height: 100 }}
					color={ref('red')}
				/>
			</GameCamera>
		</GameScreen>

		<GameScreen
			fillStyle={ref('purple')}
			size={{ width: 600, height: 720 }}
			cords={{ x: 600, y: 0 }}
		>
			<GameCamera>
				<Rectangle
					cords={{ x: 100, y: 100 }}
					size={{ width: 100, height: 100 }}
					color={ref('red')}
				/>

				<Player
					keys={{
						up: 'w',
						down: 's',
						left: 'a',
						right: 'd',
					}}
				></Player>
			</GameCamera>
		</GameScreen>
	</GameCanvas>
)

document.body.appendChild(canvas)
await game.loop()
console.log(game)
