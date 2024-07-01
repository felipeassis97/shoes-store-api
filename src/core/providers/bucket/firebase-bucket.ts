import * as uuid from 'uuid';
import * as admin from 'firebase-admin';
import { IBucket } from './i-bucket';

export class FirebaseBucket implements IBucket {

    async uploadmultipleImagesToBucket(files: [any], id: string): Promise<string[]> {
        try {
            const bucket = admin.storage().bucket();
            const imageUrls: string[] = [];

            for (const file of files) {
                const imageId = uuid.v4();
                const fileExtension = file.mimetype.split('/')[1];
                const fileName = `${id}/${id}_${imageId}.${fileExtension}`;
                const storageFile = bucket.file(fileName);

                storageFile.save(file.buffer, {
                    metadata: { contentType: file.mimetype },
                    public: true,
                    validation: 'md5'
                });

                const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
                imageUrls.push(imageUrl);
            }

            return imageUrls;
        } catch (error) {
            throw '';
        }
    }
    async uploadSingleImageToBucket(folderName: string, file: any, id: string): Promise<string> {
        try {
            const bucket = admin.storage().bucket();
            const imageId = uuid.v4();
            const fileExtension = file.mimetype.split('/')[1];
            const fileName = `${folderName}/${id}/${imageId}.${fileExtension}`;
            const storageFile = bucket.file(fileName);

            storageFile.save(file.buffer, {
                metadata: { contentType: file.mimetype },
                public: true,
                validation: 'md5'
            });
            const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
            return url;
        } catch (error) {
            throw '';
        }
    }

    async deleteFiles(folderName: string, id: string): Promise<void> {
        try {
            const bucket = admin.storage().bucket();
            const [files] = await bucket.getFiles({ prefix: `${folderName}/${id}` });

            const deletePromises = files.map(file => file.delete());
            await Promise.all(deletePromises);
            console.log(`ℹ️ All files in folder ${folderName}/${id} have been deleted.`);

        } catch (error) {
            throw new Error(`Failed to delete folder: ${error}`);
        }
    }
}