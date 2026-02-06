import axios from './httpRequester';

class BoardService {
    #url = '/board'

    async postBoard(params) {
        const res = await axios.post(this.#url, params);
        return res.data;
    }
}

export default new BoardService();