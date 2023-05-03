const GmailAPI = require("./gmailApi");

async function main() {
  const gmail = new GmailAPI();

  const searchText = "example search text";
  const messageData = await gmail.readInboxContent(searchText);

  if (messageData) {
    const decodedContent = gmail.decodeMessageContent(messageData);
    console.log("Decoded message content:", decodedContent);
  }
}

main().catch((error) => console.log(error.message));