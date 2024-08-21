export async function uploadFile(dataToUpload: Uint8Array, url: string) {
    try {
        const formData = new FormData();
        formData.append('file', dataToUpload);
        await fetch(url, {
            method: 'PUT',
            body: formData,
        });
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
