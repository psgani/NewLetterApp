const express = require("express");
const { google } = require("googleapis");
const path = require("path");
const { JSDOM } = require("jsdom");
const User = require("../models/User");

const router = express.Router();
const PARENT_FOLDER_ID = process.env.PARENT_FOLDER_ID; // Your Google Drive Folder ID

router.post("/save", async (req, res) => {
  const { content, title, googleId } = req.body; // ✅ Correct way
  console.log(req.body);

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, "../credentials.json"),
      scopes: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/documents",
      ],
    });

    const drive = google.drive({ version: "v3", auth });
    const docs = google.docs({ version: "v1", auth });

    // Step 1: Create an empty Google Docs file
    const fileMetadata = {
      name: title,
      mimeType: "application/vnd.google-apps.document",
      parents: [PARENT_FOLDER_ID],
    };

    const file = await drive.files.create({
      resource: fileMetadata,
      fields: "id",
    });

    const documentId = file.data.id;

    // Step 2: Convert HTML to Google Docs API format
    const requests = convertHtmlToGoogleDocs(content);

    await docs.documents.batchUpdate({
      documentId,
      requestBody: { requests },
    });

    await User.findOneAndUpdate(
      { googleId: googleId },
      { $push: { letters: { title, fileId: documentId } } },
      { new: true }
    );

    res.json({ fileId: documentId });
  } catch (error) {
    console.error("Error saving file:", error);
    res.status(500).json({ error: "Failed to save to Google Docs" });
  }
});

// Converts basic HTML to Google Docs requests
function convertHtmlToGoogleDocs(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const paragraphs = Array.from(document.body.children);

  const requests = [];

  paragraphs.forEach((element) => {
    if (element.tagName === "P" || element.tagName === "DIV") {
      requests.push({
        insertText: {
          location: { index: 1 },
          text: element.textContent + "\n",
        },
      });
    } else if (element.tagName === "H1") {
      requests.push({
        insertText: {
          location: { index: 1 },
          text: element.textContent + "\n",
        },
      });
      requests.push({
        updateParagraphStyle: {
          range: {
            startIndex: 1,
            endIndex: element.textContent.length + 1,
          },
          paragraphStyle: {
            namedStyleType: "HEADING_1",
          },
          fields: "namedStyleType",
        },
      });
    }
  });

  // Reverse the requests because Google Docs inserts text at index 1,
  // so we need to insert the last item first
  return requests.reverse();
}

// Fetch letters for logged-in user
router.get("/letters", async (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = await User.findOne({ googleId: req.user.googleId });
    res.json(user.letters);
    console.log(user.letters);
  } catch (error) {
    console.error("Error fetching letters:", error);
    res.status(500).json({ error: "Failed to fetch letters" });
  }
});

module.exports = router;
