import { createWriteStream } from 'fs';
import { FileUpload } from 'graphql-upload';
import path from 'path';

export const getEnvHost = () => {
  if (process.env.NODE_NEV === 'production') return process.env.HOST;
  else return process.env.HOST_DEV;
};

export async function uploadFile(photo: FileUpload): Promise<string> {
  const { createReadStream, filename } = photo;
  return new Promise(async (resolve, reject) =>
    createReadStream()
      .pipe(createWriteStream(path.join(__dirname + `/../../public/${filename}`)))
      .on('finish', () => resolve('success'))
      .on('error', (error) => reject(error))
  );
}

export async function uploadToGoogleDrive(photo: FileUpload): Promise<{ url: string }> {
  try {
    await uploadFile(photo);
  } catch (e) {
    console.warn(e);
  }

  return {
    url: `http://localhost:8000/${photo.filename}`,
  };
}
