import http from "k6/http";
import { check } from "k6";

export default function () {
  const url = "https://mai02.viet-tin.com/twirp/proto.Auth/Login";
  const payload = JSON.stringify({
    phone_number: "0000002503",
    pin: "123456",
    device_token: "123456789",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const login_response = http.post(url, payload, params);
  check(login_response, {
    "is status 200": (r) => r.status === 200,
    "is response has jwt": (r) => r.json().hasOwnProperty("access_token"),
  });
}
