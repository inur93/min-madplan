import { GetUsersApi } from "../pages/api/usersApi";


class UserStore {
    api;
    me;
    constructor() {
        this.api = GetUsersApi();
    }

    loadSelf = async () => {
        this.me = api.self();
    }
}

export default (new UserStore());