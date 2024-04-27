import CustomDataResponse from "@/responses/CustomDataResponse";
import cookieUtils from "@/utils/cookieUtils";


export default class IvoUserService {
  static endpoint = '/user';

  constructor() {
    this.cookie = cookieUtils.getCookie('ivo_access_token');
  }

  async getAllAlunos(path = `/role/aluno/`, method = 'GET') {
    const request = await fetch(`${process.env.VUE_APP_IVO_API_URL}${IvoUserService.endpoint}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${this.cookie}`,
      }
    });

    return new CustomDataResponse(request.status, await request.json());
  }

  async criarAcessoAluno(body, id, path = `/${id}/`, method = 'PATCH') {
    const request = await fetch(`${process.env.VUE_APP_IVO_API_URL}${IvoUserService.endpoint}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${this.cookie}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    return new CustomDataResponse(request.status, await request.json());
  }
}
