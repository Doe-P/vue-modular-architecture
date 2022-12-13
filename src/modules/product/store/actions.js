import {$api} from "../../../services/base-api-service/api"
export default {
    async fetchUsers({commit}, config){
        const users = await $api.users.fetch(config);
        console.log(users);
    }
}