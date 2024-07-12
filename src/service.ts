import { Init, Service } from "../../njses";
import { CreateIndexOptions, IndexModel, Pinecone, PineconeConfiguration } from "@pinecone-database/pinecone";

@Service({ name: "$$pinsecone" })
export class PineconeClient {
    readonly pc: Pinecone;
    readonly index: IndexModel;

    constructor(config: PineconeConfiguration, index: CreateIndexOptions) {
        this.pc = new Pinecone({
            apiKey: "a6799845-ea40-4818-a795-1abc39f51110",
        });
    }

    @Init
    private async _createIndex() {
        
        await this.pc.createIndex({
            name: "pinecone",
            dimension: 768,
            metric: "cosine",
        });
    }

    async get(): Promise<string> {

        return "pinecone";
    }
}
