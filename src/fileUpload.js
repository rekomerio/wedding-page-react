import { storage } from "./firebase";

export default async function upload(file, folder, name) {
    const storageRef = storage.ref();
    // Create a reference to image
    const ref = storageRef.child(folder + "/" + name);
    const fullPath = ref.fullPath; // folder/filename

    return new Promise((resolve, reject) => {
        //Send file to storage
        ref.put(file)
            .then(snapshot => {
                ref.getDownloadURL() // Get file url after it has been pushed
                    .then(url => resolve({ url, fullPath }))
                    .catch(err => reject(err));
            })
            .catch(err => console.log(err));
    });
}
