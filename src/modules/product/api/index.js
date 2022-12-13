import {ReadOnlyApiService,ModelApiService } from "../../../services/base-api-service/api"

class UsersApiService extends ReadOnlyApiService {
  constructor() {
    super("users");
  }
}

export const $api = {
  users: new UsersApiService(),
 // posts: new PostsApiService(),
 // albums: new AlbumsApiService(),
};