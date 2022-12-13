import { axios, config, apiUrl } from "../axios-service";
import createQueryBuilder from "../query-builder";
class BaseApiService {
  //baseUrl = "https://jsonplaceholder.typicode.com";
  resources;

  constructor(resources) {
    if (!resources) throw new Error("resources is not provided");
    this.resources = resources;
  }

  //   getUrl(id = "") {
  //     return `${this.baseUrl}/${this.resources}/${id}`;
  //   }

  handleErrors(payload) {
    // // Note: here you may want to add your errors handling
    // console.log({ message: "Errors is handled here", err });

    let statusText;
    const errors = new FirstErrorBag();

    function fetchFirstErrors(fErrors) {
      const nErrors = {};
      Object.keys(fErrors).forEach((key) => {
        [nErrors[key]] = fErrors[key];
      });
      return nErrors;
    }

    if (payload && payload.data) {
      if (payload.status === 401) {
        statusText = payload.data.token;
        if (statusText === "Unauthorized") {
          errors.items.push({ session_expired: "Your login session expired." });
        }
      } else if (payload.status === 422) {
        errors.items.push(payload.data.errors);
      } else if (payload.status === 429) {
        statusText = payload.data;
        if (statusText === "tooManyAttempts") {
          errors.items.push({
            too_many_requested:
              "Our system received a lot of requests. Please wait a moment.",
          });
        } else if (payload.data.errors) {
          errors.items.push(fetchFirstErrors(payload.data.errors));
        }
      } else if (payload.status === 404) {
        errors.items.push({
          not_found: "Sorry, the page you are looking for could not be found.",
        });
      } else if (payload.status === 403) {
        errors.items.push({ error: "Sorry!, Your request was rejected." });
      } else if (payload.data.errors) {
        errors.items.push(fetchFirstErrors(payload.data.errors));
      } else {
        errors.items.push({ error: "Sorry!, Something went wrong." });
      }
    } else {
      errors.items.push({ error: "Sorry!, Something went wrong." });
    }
    return errors;
  }
}

class ReadOnlyApiService extends BaseApiService {
  constructor(resources) {
    super(resources);
  }

  async fetch(payload = {}) {
    // Note: read more about fetch API here: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
    const body = {
      ...payload.query_request,
    };
    const query = createQueryBuilder(body);
    const _apiUrl = apiUrl;
    if (payload.url != null && payload.url != undefined) {
      _apiUrl = payload.url;
    }
    return new Promise((resolve, rejected) => {
      axios
        .get(
          `${_apiUrl}/${this.resources}?${query}`,
          config.addTokenHeader(payload.token)
        )
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          rejected(this.handleErrors(error.response));
        });
    });
  }

  async get(id) {
    try {
      if (!id) throw Error("Id is not provided");
      const response = await fetch(this.getUrl(id));
      return await response.json();
    } catch (err) {
      this.handleErrors(err);
    }
  }
}

class ModelApiService extends ReadOnlyApiService {
  constructor(resource) {
    super(resource);
  }
  async post(data = {}) {
    try {
      const response = await fetch(this.getUrl(), {
        method: "POST",
        body: JSON.stringify(data),
      });
      const { id } = response.json();
      return id;
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async put(id, data = {}) {
    if (!id) throw Error("Id is not provided");
    try {
      const response = await fetch(this.getUrl(id), {
        method: "PUT",
        body: JSON.stringify(data),
      });
      const { id: responseId } = response.json();
      return responseId;
    } catch (err) {
      this.handleErrors(err);
    }
  }
  async delete(id) {
    if (!id) throw Error("Id is not provided");
    try {
      await fetch(this.getUrl(id), {
        method: "DELETE",
      });
      return true;
    } catch (err) {
      this.handleErrors(err);
    }
  }
}

class UsersApiService extends ReadOnlyApiService {
  constructor() {
    super("users");
  }
}

class PostsApiService extends ModelApiService {
  constructor() {
    super("posts");
  }
}

class AlbumsApiService extends ModelApiService {
  constructor() {
    super("albums");
  }
  async uploadImage() {
    /*
      Here you create you images uploading logic
      Unfortunately, jsonplaceholder don't provide url to upload files
       */
    console.log({ message: "Image has been uploaded successfully!" });
    return true;
  }

  async triggerError() {
    try {
      throw Error("This error is triggered and handled by api module");
    } catch (err) {
      this.handleErrors(err);
    }
  }
}

export const $api = {
  users: new UsersApiService(),
  posts: new PostsApiService(),
  albums: new AlbumsApiService(),
};
