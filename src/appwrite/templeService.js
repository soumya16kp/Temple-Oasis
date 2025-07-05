import { Client, Databases, ID,Query } from 'appwrite';
import conf from '../conf/conf';

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

const databases = new Databases(client);

const templeService = {
  getEvents: async () => {
    return await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionEventId
    );
  },
  
  addDonation: async ({ userId, eventId, type, amount, quantity, item }) => {
    return await databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionDonationId,
      ID.unique(),
      {
        UserId: userId,
        EventId: eventId,
        Type: type,
        Amount: amount || 0,
        Quantity: quantity || 0,
        Item: item || '',
        TimeStamp: new Date().toISOString(),
      }
    );
  },

  getDonationsByType: async (type, limit = 10, afterId = null) => {
    const queries = [
      Query.equal("Type", [type]),
      Query.orderDesc("TimeStamp"),
      Query.limit(limit)
    ];
    
    if (afterId) {
      queries.push(Query.cursorAfter(afterId));
    }

    return await databases.listDocuments(
      conf.appwriteDatabaseId,
      conf.appwriteCollectionDonationId,
      queries
    );
  }
};

export default templeService;
