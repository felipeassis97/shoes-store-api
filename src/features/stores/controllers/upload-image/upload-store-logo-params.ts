export interface UploadStoreLogoParams {
    storeId: string;
    image: File
}

export interface UploadMultipleParams {
    storeId: string;
    images: File[]
}