import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Assuming `storage` is the Firebase Storage instance
const storage = getStorage();

const uploadProfilePictureToStorage = async (userId, file) => {
  try {
    // Create a storage reference with the user's ID as the path
    const storageRef = ref(storage, `profile-images/${userId}`);

    // Upload the file
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Get the download URL once the upload is complete
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

    return downloadURL;
  } catch (error) {
    throw error;
  }
};

export { uploadProfilePictureToStorage };
