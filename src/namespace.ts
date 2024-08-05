import {
    DeleteManyOptions,
    Index,
    ListResponse,
    Pinecone,
    PineconeRecord,
    RecordMetadata,
    ScoredPineconeRecord,
    UpdateOptions,
} from "@pinecone-database/pinecone";
import { ListOptions } from "@pinecone-database/pinecone/dist/data";
import { Service } from "../../njses/src/decorators";

export type GetManyRecordsResult<M extends RecordMetadata> = Record<string, PineconeRecord<M>>;

@Service({ name: "$$pinecone_namespace" })
export class PCNamesspace<M extends RecordMetadata = RecordMetadata> {
    private _index: Index;

    constructor(readonly client: Pinecone, index: Index, namespace: string | null) {
        this._index = namespace === null ? index : index.namespace(namespace);
    }

    upsertMany(data: PineconeRecord<M>[]): Promise<void> {
        return this._index.upsert(data);
    }

    upsert(data: PineconeRecord<M>): Promise<void> {
        return this.upsertMany([data]);
    }

    deleteMany(options: DeleteManyOptions): Promise<void> {
        return this._index.deleteMany(options);
    }

    delete(id: string): Promise<void> {
        return this._index.deleteOne(id);
    }

    /** Deletes the namesspace effectivly */
    clear(): Promise<void> {
        return this._index.deleteAll();
    }

    async query(query: any): Promise<ScoredPineconeRecord<RecordMetadata>[]> {
        const response = await this._index.query(query);
        return response.matches;
    }

    async getMany(recordIds: string[]): Promise<GetManyRecordsResult<M>> {
        const response = await this._index.fetch(recordIds);
        return response.records as Record<string, PineconeRecord<M>>;
    }

    async get(recordId: string): Promise<PineconeRecord<M> | null> {
        const recs = await this.getMany([recordId]);
        return recs[recordId] || null;
    }

    update<M extends RecordMetadata>(data: UpdateOptions<M>): Promise<void> {
        return this._index.update(data);
    }

    listPaginated(options: ListOptions): Promise<ListResponse> {
        return this._index.listPaginated(options);
    }
}
