import { ANIME_CHAN, QUOTABLE } from '../common/constants.js'
export default class QuotesService {
    static random = async () =>
        fetch(QUOTABLE.API_URL + '/random')
            .then(response => response.json())
            .then(data => data)
            .catch(err => err)

    static randomAnime = async () =>
        fetch(ANIME_CHAN.API_URL + '/random')
            .then(response => response.json())
            .then(data => data)
            .catch(err => err)
}