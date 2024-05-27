import CustomDataResponse from "@/responses/CustomDataResponse";
import cookieUtils from "@/utils/cookieUtils";


export default class ChatService {
  static endpoint = '/chat';

  constructor() {
    this.cookie = cookieUtils.getCookie('ivo_access_token');
  }

  async getChatHistory(roomName, path = `/${roomName}/`, method = 'GET') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${ChatService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.cookie}`
      }
    });

    return new CustomDataResponse(response.status, await response.json());
  }

  async deleteChatHistory(roomName, path = `/${roomName}/`, method = 'DELETE') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${ChatService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.cookie}`
      }
    });

    return new CustomDataResponse(response.status, await response.json());
  }
}
