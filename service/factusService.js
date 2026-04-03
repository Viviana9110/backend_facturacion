import axios from "axios";

const API = axios.create({
  baseURL: "https://api-sandbox.factus.com.co"
});

// 🔑 TOKEN CORRECTO
export const getFactusToken = async () => {
  const params = new URLSearchParams();

  params.append("grant_type", "password");
  params.append("client_id", process.env.CLIENT_ID);
  params.append("client_secret", process.env.CLIENT_SECRET);
  params.append("username", process.env.EMAIL);
  params.append("password", process.env.PASSWORD);

  const res = await API.post("/oauth/token", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });

  return res.data.access_token;
};

// 🧾 FACTURA
export const createFactusInvoice = async (data) => {
  const token = await getFactusToken();

  const res = await API.post("/v1/bills/validate", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return res.data;
};