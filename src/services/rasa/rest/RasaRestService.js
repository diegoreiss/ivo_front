import CustomDataResponse from "@/responses/CustomDataResponse";

export default class RasaRestService {
  async restInput(body, path = '/webhooks/rest/webhook', method = 'POST') {
    const request = await fetch(`${process.env.VUE_APP_RASA_API_URL}${path}`, {
      method,
      headers: {
        Accept: 'application/json',
      },
      body,
    });

    return new CustomDataResponse(request.status, await request.json());
  }
}
