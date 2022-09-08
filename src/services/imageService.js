import { UNSPLASH } from '../common/constants.js'
import { randomInt } from '../common/helper.js'
import '../common/discord-helper.js'
export default class ImageService {
    static random = async (query) => {
        try {
            if (!query) query = UNSPLASH.QUERY[randomInt(UNSPLASH.QUERY.length)]

            const response = await fetch(UNSPLASH.API_URL + '/random?' + query)

            return {
                url: response.url,
                image: await response.blob()
            }
        } catch (error) {
            console.log(error)
            return undefined
        }
    }
}

function test() {
    let t = 'otc'
    let e = t.toString('italic')
    console.log(e)
}
test()