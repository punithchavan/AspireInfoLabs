import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {

    //console.log("Cloudinary config:", cloudinary.config());
    // console.log("Uploading to Cloudinary: ", localFilePath);
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        //file has been uploaded successfully
        //console.log("File is uploaded on cloudinary", response.url);

        fs.unlinkSync(localFilePath); // delete the file from local storage

        return {
            url: response.secure_url,
            public_id: response.public_id
        }

    } catch (error) {
        fs.unlinkSync(localFilePath); // delete the file from local storage
        return null;
    }
}

export { uploadOnCloudinary };