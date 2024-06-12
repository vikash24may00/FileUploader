import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import uploadDocument from '@salesforce/apex/DocumentUploader1.uploadDocument';
 
export default class DocumentUploader extends LightningElement {
    @track files = [];
 
    handleFileChange(event) {
        const selectedFiles = Array.from(event.target.files);
        this.files = selectedFiles.map(file => ({
            name: file.name,
            content: null,
            base64: null,
            contentType: file.type,
            isUploading: false,
            uploadProgress: 0
        }));
 
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                this.files = this.files.map(f =>
                    f.name === file.name ? { ...f, content: reader.result, base64: base64 } : f
                );
            };
            reader.readAsDataURL(file);
        });
    }
 
    handleUpload() {
        if (this.files.length === 0) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error',
                    message: 'Please select files to upload',
                    variant: 'error'
                })
            );
            return;
        }
 
        this.uploadNextFile(0);
    }
 
    uploadNextFile(index) {
        if (index >= this.files.length) {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Documents uploaded successfully',
                    variant: 'success'
                })
            );
            this.files = [];
            return;
        }
 
        const file = this.files[index];
        file.isUploading = true;
        file.uploadProgress = 0;
 
        this.files = [...this.files]; // Force reactivity
 
        // Simulate upload progress
        const simulateProgress = () => {
            if (file.uploadProgress < 100) {
                file.uploadProgress += 10;
                this.files = [...this.files]; // Force reactivity
                setTimeout(simulateProgress, 100);
            } else {
                uploadDocument({
                    base64Data: file.base64,
                    filename: file.name,
                    contentType: file.contentType,
                    // recordId: this.recordId
                })
                .then(() => {
                    file.isUploading = false;
                    this.files = [...this.files]; // Force reactivity
                    this.uploadNextFile(index + 1);
                })
                .catch(error => {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Error uploading document',
                            message: error.body.message,
                            variant: 'error'
                        })
                    );
                });
            }
        };
 
        simulateProgress();
    }
}


// import { LightningElement } from 'lwc';
// import { ShowToastEvent } from 'lightning/platformShowToastEvent';
// import uploadDocument from '@salesforce/apex/DocumentUploader1.uploadDocument';

// export default class DocumentUploader1 extends LightningElement {
//     //  recordId; // The ID of the record to attach the document to
//     fileData; // Object to hold file details
//     fileName; // Name of the file being uploaded

//     // Handle file selection
//     handleFileChange(event) {
//         const file = event.target.files[0]; // Get the first selected file
//         if (file) {
//             this.fileName = file.name; // Store the file name
//             const reader = new FileReader();
//             reader.onload = () => {
//                 const base64 = reader.result.split(',')[1]; // Get the base64 encoded content
//                 this.fileData = {
//                     filename: file.name,
//                     base64: base64,
//                     contentType: file.type // Get the actual file type
//                 };
//             };
//             reader.readAsDataURL(file); // Read the file as Data URL
//         }
//     }

//     // Handle file upload
//     handleUpload() {
//         if (this.fileData) {
//             // Call Apex method to upload document
//             uploadDocument({
//                 base64Data: this.fileData.base64,
//                 filename: this.fileData.filename,
//                 contentType: this.fileData.contentType,
//                 // recordId: this.recordId
//             })
//             .then(result => {
//                 // Show success message
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Success',
//                         message: 'Document uploaded successfully',
//                         variant: 'success'
//                     })
//                 );
//                 // Clear file data
//                 this.fileData = null;
//                 this.fileName = null;
//             })
//             .catch(error => {
//                 // Show error message
//                 this.dispatchEvent(
//                     new ShowToastEvent({
//                         title: 'Error uploading document',
//                         message: error.body.message,
//                         variant: 'error'
//                     })
//                 );
//             });
//         } else {
//             // Show error message if no file selected
//             this.dispatchEvent(
//                 new ShowToastEvent({
//                     title: 'Error',
//                     message: 'Please select a file to upload',
//                     variant: 'error'
//                 })
//             );
//         }
//     }
// }