import { Service } from "../../njses";
import { CreateIndexOptions, Pinecone, PineconeConfiguration } from "@pinecone-database/pinecone";
import { PCCollection } from "./collection";
import { PCIndex, PCIndexOptions } from "./pc_index";

export type PCClientOptions = PineconeConfiguration;

@Service({ name: "$$pinecone_client" })
export class PCClient {
    readonly pc: Pinecone;

    constructor(config: PCClientOptions) {
        this.pc = new Pinecone(config);
    }

    getIndex(indexName: string, options: PCIndexOptions): PCIndex {
        return new PCIndex(this.pc, indexName, options);
    }

    async createIndex(config: CreateIndexOptions, options: PCIndexOptions): Promise<PCIndex> {
        await this.pc.createIndex(config);
        return new PCIndex(this.pc, config.name, options);
    }

    async listIndexes(): Promise<PCIndex[]> {
        const indexes = await this.pc.listIndexes();
        return (
            indexes.indexes?.map((index) => new PCIndex(this.pc, index.name, { indexHostUrl: index.host })) ||
            []
        );
    }

    async deleteIndex(indexName: string): Promise<void> {
        await this.pc.deleteIndex(indexName);
    }

    async createCollection(collectionName: string, indexName: string): Promise<PCCollection> {
        await this.pc.createCollection({ name: collectionName, source: indexName });
        return new PCCollection(this.pc, collectionName);
    }

    async listCollections(): Promise<PCCollection[]> {
        const collections = await this.pc.listCollections();
        return collections.collections?.map((coll) => new PCCollection(this.pc, coll.name)) || [];
    }

    async deleteCollection(collectionName: string): Promise<void> {
        await this.pc.deleteCollection(collectionName);
    }

    getCollection(collectionName: string): PCCollection {
        return new PCCollection(this.pc, collectionName);
    }
}
