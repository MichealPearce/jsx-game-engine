import { GameScreen } from './components/GameScreen'
import { Player } from './components/Player'

const canvas = document.createElement('canvas')
const game = (
	<GameScreen canvas={canvas}>
		<Player />
	</GameScreen>
)

canvas.id = 'game'
document.body.appendChild(canvas)

await game.setup()
game.loop(30)
