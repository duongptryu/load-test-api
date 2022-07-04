import http from "k6/http";
import { check, chkec, group, sleep } from "k6";

const options = {
  vus: 1000,
  duration: "600s",
};
const SLEEP_DURATION = 0.1;
const url = "https://mai02.viet-tin.com";

export default function () {
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    tags: {
      name: "register",
    },
  };

  group("User Login", (_) => {
    //Login request
    let body = JSON.stringify({
      phone_number: "0000002503",
      pin: "123456",
      device_token: "123456789",
    });
    const login_response = http.post(
      url + "/twirp/proto.Auth/Login",
      body,
      params
    );

    check(login_response, {
      "is login status 200": (r) => r.status === 200,
      "is jwt key present": (r) => r.json().hasOwnProperty("access_token"),
    });
    sleep(SLEEP_DURATION);

    //Get bank info
    params.tags.name = "bank-info";
    body = JSON.stringify({
      auth_info: {
        access_token: login_response.json()["access_token"],
      },
    });
    const bank_resp = http.post(
      url + "/twirp/proto.Auth/GetUserBankInfo",
      body,
      params
    );
    check(bank_resp, {
      "is exist user_full_name": (r) =>
        r.json().hasOwnProperty("user_full_name"),
    });
    sleep(SLEEP_DURATION);

    // Get user signature
    params.tags.name = "signature-user";
    const signature_resp = http.post(
      url + "/twirp/proto.Auth/GetUserSignature",
      body,
      params
    );
    check(signature_resp, {
      "is exist path": (r) => r.json().hasOwnProperty("path"),
    });
    sleep(SLEEP_DURATION);
  });
}
