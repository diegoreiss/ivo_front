import CustomDataResponse from "@/responses/CustomDataResponse";
import cookieUtils from "@/utils/cookieUtils";


export default class IvoTokenService {
  static endpoint = '/token';

  constructor() {
    this.cookie = cookieUtils.getCookie('ivo_access_token');
  }

  async getAccessToken(body, path = `${IvoTokenService.endpoint}/`, method = 'POST') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body
    });

    return new CustomDataResponse(response.status, await response.json()) ;
  }
}
