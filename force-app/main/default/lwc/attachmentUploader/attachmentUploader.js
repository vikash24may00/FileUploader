import { LightningElement } from 'lwc';
 
export default class AttachmentUploader extends LightningElement {
    handleFileChange(event) {
        const file = event.target.files[0];
        if (!file) return;
 
        // Read the file content
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileContent = e.target.result;
            // Convert file content to Base64
            const base64Data = this.convertToBase64(fileContent);
 
            // Pass the Base64 data to Apex method
            this.uploadFileToApex(file.name, base64Data);
        };
        reader.readAsDataURL(file);
    }
 
    convertToBase64(fileContent) {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = fileContent.split(',')[1];
        return base64;
    }
 
    uploadFileToApex(fileName, base64Data) {
        console.log(base64Data);
        // Call an Apex method to handle the Base64 data
        // Replace 'yourApexMethodName' with your actual Apex method name
        // Pass fileName and base64Data as parameters
        // Example: 'yourApexMethodName({ fileName: fileName, base64Data: base64Data })'
    }
}
 