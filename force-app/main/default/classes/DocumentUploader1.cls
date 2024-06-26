/**
 * @description       : 
 * @author            : VIKASH MUNDARI
 * @group             : 
 * @last modified on  : 06-12-2024
 * @last modified by  : VIKASH MUNDARI
**/
public class DocumentUploader1 {
    @AuraEnabled
    public static void uploadDocument(String base64Data, String filename, String contentType) {
        try {
            // Create a new Document record
            Document document = new Document();
            document.Name = filename; // Set the document name
            document.FolderId = UserInfo.getUserId(); // Use the current user's ID for the folder ID
            document.Body = EncodingUtil.base64Decode(base64Data); // Decode the base64 data
            document.ContentType = contentType; // Set the content type

            insert document; // Insert the document
          
        } catch (Exception e) {
            // Throw an exception if there's an error
            throw new AuraHandledException('Error uploading document: ' + e.getMessage());
        }
    }
}
