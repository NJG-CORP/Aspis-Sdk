import {PaginatedData, Query} from "./aspis.types";
import {Axios} from "axios";

export class AspisApi {
  private axios: Axios;

  constructor(private readonly apiKey: string, private readonly basePath = 'https://api.aspis.network/api/v1') {
    this.axios = new Axios({baseURL: basePath, headers: {'Authorization': 'Bearer ' + this.apiKey}})
  }

  async getRecord<Entity>(path: string, query?: Query<Entity>): Promise<Entity | null> {
    const results = await this.sendRequest<Entity, PaginatedData<Entity>>(path, {...query, resultsPerPage: 1});

    return results.data[0] ?? null;
  }

  async* getRecordsBatch<Entity>(path: string, query?: Query<Entity>): AsyncIterableIterator<PaginatedData<Entity>> {
    let response: PaginatedData<Entity>;
    if(!query.page) {
      query.page = 1;
    }
    do {
      response = await this.sendRequest<Entity, PaginatedData<Entity>>(path, query);
      yield response;
      query.page++;
    } while (response.data.length === Math.min(1_000, query?.resultsPerPage))
  }

  async sendRequest<Entity, Data>(path: string, query?: Query<Entity>): Promise<Data> {
    return JSON.parse((await this.axios.post(path, JSON.stringify(query), {headers: {"Content-Type": 'application/json'}})).data)
  }
}
