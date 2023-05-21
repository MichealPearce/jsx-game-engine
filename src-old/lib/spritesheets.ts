export interface SpriteSheet {
	image: HTMLImageElement
	frames: {
		[name: string]: {
			frame: {
				x: number
				y: number
				w: number
				h: number
			}
			rotated: boolean
			trimmed: boolean
			spriteSourceSize: {
				x: number
				y: number
				w: number
				h: number
			}
			sourceSize: {
				w: number
				h: number
			}
		}
	}
	meta: {
		name: string
		image: string
		format: string
		size: {
			w: number
			h: number
		}
		scale: number
	}
}

export async function loadSpriteSheetImage(
	url: string,
): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve(image)
		image.onerror = reject
		image.src = url
	})
}

export async function getSpriteSheet(name: string): Promise<SpriteSheet> {
	const { default: data } = await import(`../assets/spritesheets/${name}.json`)
	const { default: image } = await import(`../assets/spritesheets/${name}.png`)

	data.meta.name = name
	data.meta.image = image

	data.image = await loadSpriteSheetImage(data.meta.image)

	return data
}
