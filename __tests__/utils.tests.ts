import { getImageCenterPositionOnCanvas, getRatio, getScaledImageDimensions } from "../lib/utils"

const img1 = {width: 1000, height: 2000}
const img2 = {width: 500, height: 500}

it('gets the min ratio between 2 images', () => {
    const ratio = getRatio(img1, img2)

    expect(typeof ratio).toBe('number')
    expect(ratio).toBe(2)
})

it('gets the center position', () => {
    const ratio = 1
    const position = getImageCenterPositionOnCanvas(img1, img2, ratio)

    expect(position.x).toBeDefined()
    expect(position.y).toBeDefined()
    expect(position).toEqual({x: -250, y: -750})
})

it('gets the scaled dimensions based on ratio', () => {
    const ratio = 0.5
    const dimensions = getScaledImageDimensions(img1, ratio)

    expect(dimensions.height).toBeDefined()
    expect(dimensions.width).toBeDefined()
    expect(dimensions).toEqual({width: 500, height: 1000})
})