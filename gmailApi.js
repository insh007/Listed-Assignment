const axios = require("axios");
const qs = require("qs");

class GmailAPI {
  accessToken = "";

  constructor() {
    // Get access token on object initialization
    this.getAccessToken();
  }

  /**
   * Fetches access token using the provided credentials
   * @returns {string} Access Token
   */
  getAccessToken = async () => {
    try {
      const data = qs.stringify({
        client_id:
          "148618590339-pc654iasemuv2ocq9840a98mu6rpngaq.apps.googleusercontent.com",
        client_secret: "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",
        refresh_token:
          "1//041E6RHvoKM5lCgYIARAAGAQSNwF-L9IrH4LYsyoEQictNyFIfTlwG65-HeiKOTjfjnyBBL9lpHK8qjFmIxqW3XbKP4igzlBXT2k",
        grant_type: "refresh_token",
      });

      const config = {
        method: "post",
        url: "https://accounts.google.com/o/oauth2/token",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      const response = await axios(config);
      this.accessToken = response.data.access_token;

      console.log("Access Token " + this.accessToken);
    } catch (error) {
      console.log("Error while getting access token:", error);
    }
  };

  /**
   * Searches Gmail for the given search item
   * @param {string} searchItem Search item
   * @returns {string} Thread ID of the first message found
   */
  searchGmail = async (searchItem) => {
    try {
      const config = {
        method: "get",
        url: `https://www.googleapis.com/gmail/v1/users/me/messages?q=${searchItem}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      };

      const response = await axios(config);
      const threadId = response.data["messages"][0].id;

      console.log("ThreadId = " + threadId);

      return threadId;
    } catch (error) {
      console.log("Error while searching Gmail:", error);
      return null;
    }
  };

  /**
   * Reads the content of the given message ID
   * @param {string} messageId Message ID
   * @returns {Object} Message data
   */
  readGmailContent = async (messageId) => {
    try {
      const config = {
        method: "get",
        url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
      };

      const response = await axios(config);
      const data = response.data;

      return data;
    } catch (error) {
      console.log("Error while reading Gmail content:", error);
      return null;
    }
  };

  /**
   * Reads the content of the first message found for the given search text
   * @param {string} searchText Text to search for
   * @returns {string} Decoded content of the message
   */
  readInboxContent = async (searchText) => {
    try {
        console.log(config);
      const threadId = await this.searchGmail(searchText);

      if (!threadId) {
        console.log(`No messages found for search text: ${searchText}`);
      } else {
        const config = {
          method: "get",
          url: `https://www.googleapis.com/gmail/v1/users/me/threads/${threadId}`,
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        };
        const response = await axios(config);
        const messages = response.data["messages"];

        // Get the message ID of the first message in the thread
        const messageId = messages[0].id;

        // Read the content of the first message in the thread
        const messageData = await this.readGmailContent(messageId);

        // Decode the message content
        const messageContent = Buffer.from(
          messageData.payload.parts[0].body.data,
          "base64"
        ).toString();

        return messageContent;
      }
    } catch (error) {
      console.log("Error while reading inbox content:", error);
      return null;
    }
  };
}

module.exports = GmailAPI;
