const express = require("express");
const axios = require("axios");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Albany OAuth Callback Server Running");
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.send("No authorization code received.");
  }

  try {
    const response = await axios.post(
      "https://api.podium.com/oauth/token",
      {
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.REDIRECT_URI,
        client_id: process.env.PODIUM_CLIENT_ID,
        client_secret: process.env.PODIUM_CLIENT_SECRET
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Access Token:", response.data);

    res.send("OAuth successful. Token received.");
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send("OAuth failed.");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
