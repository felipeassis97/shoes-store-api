import { UploadMultipleParams, UploadStoreLogoParams } from "./upload-store-logo-params";
import { IBucket } from "../../../../core/providers/bucket/i-bucket";
import { badRequest, internalError, ok } from "../../../../core/helpers/helpers";
import { HttpRequest, HttpResponse, IController } from "../../../../core/protocols/protocols";

export class UploadMultipleImages implements IController {
    constructor(private readonly bucket: IBucket) { }

    async handle(httpRequest: HttpRequest<UploadMultipleParams>): Promise<HttpResponse<string>> {
        const body = httpRequest.body;
        const files = httpRequest.files as Express.Multer.File[];

        try {
            if (!files || files.length === 0 || !body) {
                return badRequest("Image files and storeId are required");
            }
            if (files.length > 4) {
                return badRequest("Max 4 images");
            }
            const response = await this.bucket.uploadmultipleImagesToBucket(files, body.storeId);
            return ok(response);
        }
        catch (error) {
            return internalError(`${error}`);
        }
    }
}