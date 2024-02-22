import { getDownloadURL, ref } from "firebase/storage";

export const getFilesDownloadUrlsArray = async (storage, arrayImagesRelativePath) => {
  //Iterar sobre cada item del arrayImagesRelativePath, generar downloadurl y agregarlo a un array de promesas
  const promises = arrayImagesRelativePath.map(async (imageRelativePath) => {
    const imageRef = ref(storage, imageRelativePath);
    const downloadUrl = await getDownloadURL(imageRef);
    return downloadUrl;
  });

  const downloadUrls = await Promise.all(promises);
  return downloadUrls;
};
