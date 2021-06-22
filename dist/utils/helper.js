"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToGoogleDrive = exports.generatePublicUrl = exports.uploadFile = exports.getEnvHost = exports.getUserLogged = void 0;
const googleapis_1 = require("googleapis");
const getUserLogged = ({ req }) => {
    const token = req.cookies;
    console.log(token);
};
exports.getUserLogged = getUserLogged;
const getEnvHost = () => {
    if (process.env.NODE_NEV === "production")
        return process.env.HOST;
    else
        return process.env.HOST_DEV;
};
exports.getEnvHost = getEnvHost;
function uploadFile(drive, photo) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield drive.files.create({
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
            return response.data.id;
        }
        catch (e) {
            console.log(e);
            throw e;
        }
    });
}
exports.uploadFile = uploadFile;
function generatePublicUrl(drive, fileId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield drive.permissions.create({
                fileId,
                requestBody: {
                    role: "reader",
                    type: "anyone",
                },
            });
            const url = yield drive.files.get({
                fileId,
                fields: "webContentLink",
            });
            if (!url)
                throw new Error("Cannot generate Url");
            return url.data.webContentLink;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.generatePublicUrl = generatePublicUrl;
function uploadToGoogleDrive(photo) {
    return __awaiter(this, void 0, void 0, function* () {
        const CLIENT_ID = "985759029420-2a3da1brkp805s978pp9na5nof5epftg.apps.googleusercontent.com";
        const CLIENT_SECRET = "mKJVuyW83h8V60UNu8Tw-MfY";
        const REDIRECT_URL = "https://developers.google.com/oauthplayground";
        const GOOGLE_REFRESH_TOKEN = "1//04hAafm21vUAmCgYIARAAGAQSNwF-L9IrrK9Iyi4_FTHaVHARyMiBAWLNlnpr7Fm1Pmh51SW4FwnD8WEbNOEy90qSVO51k-rZOn0";
        const oAuth2Client = new googleapis_1.google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
        oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
        const drive = googleapis_1.google.drive({
            version: "v3",
            auth: oAuth2Client,
        });
        const fileId = yield uploadFile(drive, photo);
        const url = yield generatePublicUrl(drive, fileId);
        return {
            url,
        };
    });
}
exports.uploadToGoogleDrive = uploadToGoogleDrive;
//# sourceMappingURL=helper.js.map