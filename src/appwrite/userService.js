import conf from "../conf/conf";
import {Client,ID,Databases,Storage,Query} from "appwrite";

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

    async createUser({Name,Email,Mobile,Position,Rank=2,UserID,slug}){
        try{
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    Name,
                    Email,
                    Mobile,
                    Position,
                    Rank,
                    UserID,
                }
            )
        }
        catch(error){
            throw error;
        }
    }


    async getUser(userId) {
        try {
            const response = await this.databases.listDocuments(
            conf.appwriteDatabaseId,
            conf.appwriteCollectionId,
            [
                Query.equal('UserID', userId)
            ]
            );

            if (response.total === 0) {
            throw new Error('User profile not found in database');
            }

            return response.documents[0];
        } catch (error) {
            console.error('Appwrite service :: getUser error', error);
            throw error;
        }
    }


async updateUser(userId, updatedFields) {
  try {

    const existingUser = await this.getUser(userId);
    const documentId = existingUser.$id;

    const newData = {
      ...existingUser,
      ...updatedFields
    };

    for (const key in newData) {
        if (key.startsWith('$')) {
            delete newData[key];
        }
    }


    return await this.databases.updateDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionId,
      documentId,
      newData
    );

  } catch (error) {
    console.error("Appwrite service :: updateUser error", error);
    throw error;
  }
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

const userService = new Service();
export default userService;
