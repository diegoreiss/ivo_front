import CustomDataResponse from "@/responses/CustomDataResponse";
import cookieUtils from "@/utils/cookieUtils";


export default class BotService {
  static endpoint = '/bot';

  constructor() {
    this.cookie = cookieUtils.getCookie('ivo_access_token');
  }

  async getAllIntents(page = 1, path = `/intent/?page=${page}`, method = 'GET') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${BotService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.cookie}`,
      },
    });

    return new CustomDataResponse(response.status, await response.json());
  }

  async createIntent(path = `/intent`, method = 'POST') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${BotService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.cookie}`,
      }
    });

    return new CustomDataResponse(response.status, await response.json());
  }
}

