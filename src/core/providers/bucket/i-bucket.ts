export interface IBucket {
    uploadSingleImageToBucket(folderName: string, file: any, id: string): Promise<string>
    uploadmultipleImagesToBucket(files: Express.Multer.File[], id: string): Promise<string[]>
    deleteFiles(folderName: string, id: string): Promise<void>
}

