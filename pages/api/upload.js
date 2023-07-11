import multiparty from 'multiparty'; 
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
      // User is not logged in
      res.status(401).json({ error: 'You are not authenticated' });
      return;
  }

  if (session.user?.email !== process.env.ADMIN_EMAIL) {
      // User is logged in, but not with the specific admin email
      res.setHeader('Set-Cookie', [
          `next-auth.session-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          `next-auth.csrf-token=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
      ]);
      res.status(403).json({ error: 'You are not authorized' });
  }

  const form = new multiparty.Form();

  const {fields, files} = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if(err) reject(err);
      resolve({fields,files})
    })
  })

  const client = new S3Client({
    region: 'eu-central-1',
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
  })

  function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
       return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid; 
  };

  let image_links = [];
  for(const file of files.file) {
    const extension = file.originalFilename.split('.').pop();
    const s3_filename = generateUUID() + '.' + extension
    
    await client.send(new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: s3_filename,
      Body: fs.readFileSync(file.path),
      ACL: 'public-read',
      ContentType: mime.lookup(file.path)
    }))

    const link = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${s3_filename}`;
    image_links.push(link)
  }

  return res.json({image_links})
}


export const config = {
  api: {
    bodyParser:false
  }
}
