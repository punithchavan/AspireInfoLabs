import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import path from "path";
import {ApiError} from "./ApiError.js";




const deleteCloudinaryImage = async (publicId) =>{
    try {
        if(!publicId) {
            throw new ApiError(400, "Public ID is required to delete image");
        }
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== "ok") {
            throw new ApiError(500, "Failed to delete image from Cloudinary");
        } else{
            return {message: "Image deleted successfully"};
        }
    } catch (error) {
        throw new ApiError(500, "Failed to delete image from Cloudinary");
    }
};


const deleteLocalFile = (filePath) =>{
    try {
        if (!filePath) {
            throw new ApiError(400, "File path is required to delete image");
        }
        const absolutePath = path.resolve(filePath);
        fs.unlinkSync(absolutePath);
        return {message: "Local file deleted successfully"};
    } catch (error) {
        throw new ApiError(500, "Failed to delete local file");
    }
}

export {deleteCloudinaryImage, deleteLocalFile};