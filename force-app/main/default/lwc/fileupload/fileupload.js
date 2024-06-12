import { LightningElement, api, wire, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getFilesForRecord from '@salesforce/apex/FileHandler.getFilesForRecord';
import { refreshApex } from '@salesforce/apex';

export default class FileUploader extends LightningElement {
 recordId; // Record Id to which the files are associated
     files = []; // List to store files related to the record
    wiredFilesResult; // To store the result of the wired method

    // Columns definition for the lightning-datatable
    columns = [
        { label: 'Title', fieldName: 'Title' }, // Column for the file title
        {
            label: 'View',
            type: 'button',
            typeAttributes: {
                label: 'View',
                name: 'view',
                variant: 'base',
            },
        },
    ];

    // Wired method to get files related to the record
    @wire(getFilesForRecord, { recordId: '$recordId' })
    wiredFiles(result) {
        this.wiredFilesResult = result;
        if (result.data) {
            // Map the result data to the files array and use LatestPublishedVersionId as Id for the datatable
            this.files = result.data.map(file => ({
                ...file,
                Id: file.LatestPublishedVersionId 
            }));
        } else if (result.error) {
            this.showToast('Error', result.error.body.message, 'error');
        }
    }

    // Event handler for file upload finished
    handleUploadFinished(event) {
        this.showToast('Success', 'File uploaded successfully', 'success');
        // Refresh the list of files after upload
        return refreshApex(this.wiredFilesResult);
    }

    // Event handler for row actions in the datatable
    handleRowAction(event) {
        const actionName = event.detail.action.name;
        const row = event.detail.row;
        if (actionName === 'view') {
            // Open the file in a new tab for viewing
            window.open(`/sfc/servlet.shepherd/version/download/${row.Id}`, '_blank');
        }
    }

    // Method to show toast messages
    showToast(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }
}
