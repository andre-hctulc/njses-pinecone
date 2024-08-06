import {
    ConfigureIndexRequestSpecPod,
    Index,
    IndexModel,
    Pinecone,
    RecordMetadata,
} from "@pinecone-database/pinecone";
import { App, Service } from "../../njses";
import { PCNamesspace } from "./namespace";

export type PCIndexOptions = {
    indexHostUrl?: string;
    additionalHeaders?: Record<string, string>;
};

@Service({ name: "$$pinecone_index" })
export class PCIndex {
    readonly name: string;
    readonly pcIndex: Index<RecordMetadata>;

    constructor(readonly client: Pinecone, indexName: string, readonly options: PCIndexOptions = {}) {
        this.name = indexName;
        this.pcIndex = this.client.index(
            this.name,
            this.options.indexHostUrl,
            this.options.additionalHeaders
        );
    }

    describe(): Promise<IndexModel> {
        return this.client.describeIndex(this.name);
    }

    /**
     * Creates and returns a namespace entity.
     */
    getNamespace<M extends RecordMetadata = RecordMetadata>(
        namespace: string | null
    ): Promise<PCNamesspace<M>> {
        return App.createEntity(PCNamesspace<M>, this.client, this.pcIndex, namespace);
    }

    update(options: ConfigureIndexRequestSpecPod): Promise<IndexModel> {
        return this.client.configureIndex(this.name, options);
    }
}
