import { drive_v3, google } from "googleapis";
import { FileUpload } from "graphql-upload";
import { MovieContext } from "../MovieContext";

export const getUserLogged = ({ req }: MovieContext) => {
  const token = req.cookies;
  console.log(token);
};

export const getEnvHost = () => {
  if (process.env.NODE_NEV === "production") return process.env.HOST;
  else return process.env.HOST_DEV;
};

export async function uploadFile(
  drive: drive_v3.Drive,
  photo: FileUpload
): Promise<string> {
  try {
    const response = await drive.files.create({
      requestBody: {
        name: photo.filename,
        mimeType: photo.mimetype,
      },
      media: {
        mimeType: photo.mimetype,
        body: photo.createReadStream(),
      },
    });

    if (!response) {
      throw new Error("Error occure");
    }

    return response.data.id!;
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function generatePublicUrl(
  drive: drive_v3.Drive,
  fileId: string
): Promise<string> {
  try {
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const url = await drive.files.get({
      fileId,
      fields: "webContentLink",
    });

    if (!url) throw new Error("Cannot generate Url");

    return url.data.webContentLink!;
  } catch (e) {
    throw e;
  }
}

export async function uploadToGoogleDrive(
  photo: FileUpload
): Promise<{ url: string }> {
  const CLIENT_ID =
    "985759029420-2a3da1brkp805s978pp9na5nof5epftg.apps.googleusercontent.com";
  const CLIENT_SECRET = "mKJVuyW83h8V60UNu8Tw-MfY";
  const REDIRECT_URL = "https://developers.google.com/oauthplayground";
  const GOOGLE_REFRESH_TOKEN =
    "1//04hAafm21vUAmCgYIARAAGAQSNwF-L9IrrK9Iyi4_FTHaVHARyMiBAWLNlnpr7Fm1Pmh51SW4FwnD8WEbNOEy90qSVO51k-rZOn0";

  const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URL
  );

  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

  const drive = google.drive({
    version: "v3",
    auth: oAuth2Client,
  });

  const fileId = await uploadFile(drive, photo);

  const url = await generatePublicUrl(drive, fileId);
  return {
    url,
  };
}
