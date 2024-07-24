import {
    ConfigureIndexRequestSpecPod,
    Index,
    IndexModel,
    Pinecone,
    RecordMetadata,
} from "@pinecone-database/pinecone";
import { Service, ServiceRegistery } from "../../njses";
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
     * Mounts the given namespace
     */
    getNamespace<M extends RecordMetadata = RecordMetadata>(
        namespace: string | null
    ): Promise<PCNamesspace<M>> {
        return ServiceRegistery.mount(PCNamesspace, this.client, this.pcIndex, namespace) as Promise<
            PCNamesspace<M>
        >;
    }

    update(options: ConfigureIndexRequestSpecPod): Promise<IndexModel> {
        return this.client.configureIndex(this.name, options);
    }
}
