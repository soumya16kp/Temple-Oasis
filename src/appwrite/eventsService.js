import conf from "../conf/conf";
import {Client,ID,Databases,Storage, Query} from "appwrite";

export class Service{
    client=new Client();
    databases;
    bucket;

    constructor() {
        this.client
            .setEndpoint(conf.appwriteUrl)
            .setProject(conf.appwriteProjectId);

        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    

    async createEvent({ title, description,lastDate,eventDate }) {
        return await this.databases.createDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionEventId,
            ID.unique(),
            {
            Title: title,
            Description: description,
            Date: lastDate,
            EventDate: eventDate,
            }
        );
    }

    async updateEvent(documentId, updatedFields) {
        try {
             for (const key in updatedFields) {
                if (key.startsWith('$')) {
                    delete updatedFields[key];
                }
            }

            return await this.databases.updateDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionEventId,
            documentId,
            updatedFields
            );

        } catch (error) {
            console.error("Appwrite service :: updateUser error", error);
            throw error;
        }
    }

    async listEvents(){
        return await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionEventId
        );
    }

    async getEvent(id){
        return await this.databases.getDocument(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionEventId,
            id
        );
    }

    async uploadFile(file){
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log("Appwrite serive :: uploadFile :: error", error);
            return false
        }
    }

    async deleteFile(fileId) {
        try {
            await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
            return true;
        } catch (error) {
            console.log("Appwrite service :: deleteFile error", error);
            return false;
        }
    }

    
    getFilePreview(fileId){
        return this.bucket.getFileView(
            conf.appwriteBucketId,
            fileId
        )
    }
}

const eventService = new Service();
export default eventService;
