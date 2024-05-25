export default class CustomDataResponse {
  constructor(status_code, json) {
    this.status_code = status_code;
    this.json = json;
  }
}
