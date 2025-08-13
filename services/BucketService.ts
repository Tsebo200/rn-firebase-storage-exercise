import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase"

// TODO: Upload Image to Buckets
export const uploadImageToBucket = async (imageUri: string, imageName: string) => {

    // create our storage reference
    // this is where we will upload our image
    const storageRef = ref(storage, `images/${imageName}`)

    // convert the image to a blob (binary large object)
    const blob = await new Promise<Blob>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
            resolve(xhr.response);
        }

        xhr.onerror = () => {
            reject(new Error("Failed to convert image to blob")); //error handling
        };

        xhr.responseType = "blob";
        xhr.open("GET", imageUri, true); //opening the image uri location
        xhr.send(null);
    })
    // Trying to upload the blob to our storage reference
    const uploadResult = await uploadBytes(storageRef, blob);

    return await getDownloadURL(storageRef); //return the download URL of the uploaded image
}