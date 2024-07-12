import { Service, ServiceRegistery } from "../../njses";
import { CreateIndexOptions, Pinecone, PineconeConfiguration } from "@pinecone-database/pinecone";
import { PCCollection } from "./collection";
import { PCIndex, PCIndexOptions } from "./pc_index";
import { deleteCollection } from "@pinecone-database/pinecone/dist/control";

export type PCClientOptions = PineconeConfiguration;

@Service({ name: "$$pinecone_client" })
export class PCClient {
    readonly pc: Pinecone;

    constructor(config: PCClientOptions) {
        this.pc = new Pinecone(config);
    }

    async createIndex(config: CreateIndexOptions, options: PCIndexOptions): Promise<PCIndex> {
        await this.pc.createIndex(config);
        return ServiceRegistery.create(PCIndex, this.pc, config.name, options);
    }

    async listIndexes(): Promise<PCIndex[]> {
        const indexes = await this.pc.listIndexes();
        return await Promise.all<PCIndex>(
            indexes.indexes?.map((index) =>
                ServiceRegistery.create(PCIndex, this.pc, index.name, { indexHostUrl: index.host })
            ) || []
        );
    }

    async deleteIndex(indexName: string): Promise<void> {
        await this.pc.deleteIndex(indexName);
    }

    async createCollection(collectionName: string, indexName: string): Promise<PCCollection> {
        await this.pc.createCollection({ name: collectionName, source: indexName });
        return ServiceRegistery.create(PCCollection, this.pc, collectionName);
    }

    async listCollections(): Promise<PCCollection[]> {
        const collections = await this.pc.listCollections();
        return await Promise.all<PCCollection>(
            collections.collections?.map((coll) =>
                ServiceRegistery.create(PCCollection, this.pc, coll.name)
            ) || []
        );
    }

    async deleteCollection(collectionName: string): Promise<void> {
        await this.pc.deleteCollection(collectionName);
    }
}
