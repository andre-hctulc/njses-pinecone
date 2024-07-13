import { Pinecone } from "@pinecone-database/pinecone";

/*
reference:
https://docs.pinecone.io/guides/indexes/understanding-collections
*/

export class PCCollection {
    readonly name: string;

    constructor(readonly client: Pinecone, collectionName: string) {
        this.name = collectionName;
    }
    
    async describe() {
        this.client.describeCollection(this.name);
    }
}
