const path = require("path");
const admin = require("firebase-admin");
const { v4: uuidv4 } = require("uuid");

const serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
};

const storageBucket = `${serviceAccount.project_id}.appspot.com`;
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket,
});

const bucket = admin.storage().bucket();

const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const token = uuidv4();
    const metadata = {
      metadata: {
        firebaseStorageDownloadTokens: token,
      },
      cacheControl: "public, max-age=31536000",
    };

    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;

    const fileRef = bucket.file(filename);
    const blobStream = fileRef.createWriteStream({ metadata });

    blobStream.on("error", (err) => {
      reject(err.message);
    });

    blobStream.on("finish", () => {
      const url = `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/${filename}?alt=media&token=${token}`;
      resolve(url);
    });

    blobStream.end(file.buffer);
  });

const deleteImage = (fileUrl) =>
  new Promise((resolve, reject) => {
    const filename = fileUrl.split(".com/o/")[1].split("?alt")[0];
    const fileRef = bucket.file(filename);

    fileRef
      .delete()
      .then(() => resolve())
      .catch((err) => reject(err.message));
  });

module.exports = { uploadImage, deleteImage };
