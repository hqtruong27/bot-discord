import { QUOTES } from '../common/constants.js'
export default class QuotesService {
    static random = async () =>
        fetch(QUOTES.QUOTABLE_URL + '/random')
            .then(response => response.json())
            .then(data => data)
            .catch(err => err)

    static randomAnime = async () =>
        fetch(QUOTES.ANIME_CHAN_URL + '/random')
            .then(response => response.json())
            .then(data => data)
            .catch(err => err)
}