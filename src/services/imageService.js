import '../common/discord-helper.js'
import axios from 'axios'
import { UNSPLASH } from '../common/constants.js'
import { randomInt } from '../common/helper.js'
export default class ImageService {
    static random = async (query) => {
        try {
            const q = UNSPLASH.QUERY
            const index = (randomInt(1, q.length) - 1)
            if (!query) query = q[index]
            console.log({ query, q: index })
            const {
                data,
                request: {
                    res: { responseUrl }
                }
            } = await axios.get(UNSPLASH.API_URL + '/random?' + query)

            return {
                url: responseUrl,
                image: data
            }
        } catch (error) {
            console.log(error)
            return undefined
        }
    }
}