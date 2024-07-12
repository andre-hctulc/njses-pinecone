import { CreateCollectionRequest, Pinecone } from "@pinecone-database/pinecone";
import { Init, Service } from "../../njses";

/*
reference:
https://docs.pinecone.io/guides/indexes/understanding-collections
*/

@Service({ name: "$$pinecone_collection" })
export class PCCollection {
    readonly name: string;

    constructor(readonly client: Pinecone, collectionName: string) {
        this.name = collectionName;
    }
    
    async describe() {
        this.client.describeCollection(this.name);
    }
}
