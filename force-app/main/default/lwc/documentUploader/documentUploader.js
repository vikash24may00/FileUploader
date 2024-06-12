import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadDocument from '@salesforce/apex/DocumentUploader1.uploadDocument';

export default class DocumentUploader1 extends LightningElement {
    //  recordId; // The ID of the record to attach the document to
    fileData; // Object to hold file details
    fileName; // Name of the file being uploaded

    // Handle file selection
    handleFileChange(event) {
        const file = event.target.files[0]; // Get the first selected file
        if (file) {
            this.fileName = file.name; // Store the file name
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1]; // Get the base64 encoded content
                this.fileData = {
                    filename: file.name,
                    base64: base64,
                    contentType: file.type // Get the actual file type
                };
            };
            reader.readAsDataURL(file); // Read the file as Data URL
        }
    }

    // Handle file upload
    handleUpload() {
        if (this.fileData) {
            // Call Apex method to upload document
            uploadDocument({
                base64Data: this.fileData.base64,
                filename: this.fileData.filename,
                contentType: this.fileData.contentType,
                // recordId: this.recordId
            })
            .then(result => {
                // Show success message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Document uploaded successfully',
                        variant: 'success'
                    })
                );
                // Clear file data
                this.fileData = null;
                this.fileName = null;
            })
            .catch(error => {
                // Show error message
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error uploading document',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        } else {
            // Show error message if no file selected
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select a file to upload',
                    variant: 'error'
                })
            );
        }
    }
}

