import CryptoJS from "crypto-js";


const getBlobFromUrl = (myImageUrl) => {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open('GET', myImageUrl, true);
        request.responseType = 'blob';
        request.onload = () => {
            resolve(request.response);
        };
        request.onerror = reject;
        request.send();
    })
}

const getDataFromBlob = (myBlob) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.readAsArrayBuffer(myBlob);
        reader.onloadend = function () {
            var wordArray = CryptoJS.lib.WordArray.create(reader.result),
                hash = CryptoJS.MD5(wordArray).toString();
            // or CryptoJS.SHA256(wordArray).toString(); for SHA-2
            resolve(hash);
        };

    })
}

const convertUrlToHash = async (myImageUrl) => {
    try {
        let myBlob = await getBlobFromUrl(myImageUrl);
        let myImageData = await getDataFromBlob(myBlob);
        return myImageData;
    } catch (err) {
        return null;
    }
}

export default convertUrlToHash;