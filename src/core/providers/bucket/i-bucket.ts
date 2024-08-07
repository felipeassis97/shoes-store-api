export interface IBucket {
    uploadSingleImageToBucket(folderName: string, file: any, id: string): Promise<string>
    uploadmultipleImagesToBucket(folderName: string, files: Express.Multer.File[], id: string): Promise<string[]>
    deleteFiles(folderName: string, id: string): Promise<void>
}

