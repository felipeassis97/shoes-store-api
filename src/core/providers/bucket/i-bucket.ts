export interface IBucket {
    uploadSingleImageToBucket(file: any, id: string): Promise<string>
    uploadmultipleImagesToBucket(files: Express.Multer.File[], id: string): Promise<string[]>
}

