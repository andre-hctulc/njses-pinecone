import { Service } from "../../njses";

@Service({ name: "$$pinsecone" })
export class PineconeService {
    constructor(){
        
    }

    async get(): Promise<string> {
        return "pinecone";
    }
}
