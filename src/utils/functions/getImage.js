import { getDownloadURL, ref } from "firebase/storage";

export const getFileDownloadUrl = async (storage, imageRelativePath) => {
  const imageRef = ref(storage, imageRelativePath);
  const downloadUrl = await getDownloadURL(imageRef);
  return downloadUrl;
};
