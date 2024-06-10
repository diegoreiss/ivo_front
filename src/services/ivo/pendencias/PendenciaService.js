import CustomDataResponse from "@/responses/CustomDataResponse";
import cookieUtils from "@/utils/cookieUtils"

export default class PendenciaService {
  static endpoint = '/pendencia'

  constructor() {
    this.cookie = cookieUtils.getCookie('ivo_access_token');
  }

  async getAllPendencias(page, path = `/?page=${page}`, method = 'GET') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${PendenciaService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Api-Key ${process.env.VUE_APP_IVO_API_KEY}`
      }
    });

    return new CustomDataResponse(response.status, await response.json());
  }

  async getPendenciasByUser(page, uuid,  path = `/${uuid}/?page=${page}`, method = 'GET') {
    const response = await fetch(`${process.env.VUE_APP_IVO_API_URL}${PendenciaService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Api-Key ${process.env.VUE_APP_IVO_API_KEY}`
      },
    });

    return new CustomDataResponse(response.status, await response.json());
  }
}
