/**
 * @description       : Handles file operations related to a specific Salesforce record, such as retrieving and uploading files.
 * @last modified on  : 06-11-2024
 * @last modified by  : VIKASH MUNDARI
 **/
public with sharing class FileHandler {

    /**
     * Retrieves the list of ContentDocument records associated with a given record.
     * @param recordId The Id of the record (e.g., Account, Contact) for which to retrieve the associated files.
     * @return A List of ContentDocument records related to the specified record.
     */
    @AuraEnabled(cacheable=true)
    public static List<ContentDocument> getFilesForRecord(Id recordId) {
        // Query to get all ContentDocumentLink records for the given record ID.
        List<ContentDocumentLink> contentDocumentLinks = null;
        try {
            contentDocumentLinks = [
                SELECT ContentDocumentId
                FROM ContentDocumentLink 
                WHERE LinkedEntityId = :recordId
            ];
        } catch (Exception e) {
            // Log the exception or handle it appropriately.
            System.debug('Exception occurred while querying ContentDocumentLinks: ' + e.getMessage());
            return new List<ContentDocument>();
        }

        // Create a Set to store unique ContentDocumentIds.
        Set<Id> documentIds = new Set<Id>();
        
        // Loop through the ContentDocumentLink records to extract the ContentDocumentIds.
        for (ContentDocumentLink link : contentDocumentLinks) {
            documentIds.add(link.ContentDocumentId);
        }

        // If there are any ContentDocumentIds, query the ContentDocument records using the collected IDs.
        if (!documentIds.isEmpty()) {
            try {
                return [
                    SELECT Id, Title, LatestPublishedVersionId 
                    FROM ContentDocument 
                    WHERE Id IN :documentIds
                ];
            } catch (Exception e) {
                // Log the exception or handle it appropriately.
                System.debug('Exception occurred while querying ContentDocuments: ' + e.getMessage());
                return new List<ContentDocument>();
            }
        } else {
            // Return an empty list if no ContentDocumentIds are found.
            return new List<ContentDocument>();
        }
    }
}
