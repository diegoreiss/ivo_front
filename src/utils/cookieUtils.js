const cookieUtils = {
  setCookie: function(name, value) {
    document.cookie = `${name}=${value};domain=localhost;Path=/`;
  },
  getCookie: function(name) {
    const cookieName = `${name}=`;
    let decodedCookie = decodeURIComponent(document.cookie),
      ca = decodedCookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }

      if (c.indexOf(cookieName) == 0) {
        return c.substring(cookieName.length, c.length);
      }
    }

    return "";
  },
  deleteCookie: function(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=localhost;`
  }
}

export default cookieUtils;
