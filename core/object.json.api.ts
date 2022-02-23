import { JsonApi, JsonApiData, JsonApiError } from './json.api';


export interface ObjectJsonApiData extends JsonApiData { }

export interface ObjectJsonApiDataList<T = ObjectJsonApiData> extends ObjectJsonApiData {
    items: T[];
}

export interface ObjectJsonApiError extends JsonApiError {
    code: number;
    status: string;
    message?: string;
    reason: string;
    details: {
        name: string;
        kind: string;
    };
}

export interface ObjectJsonApiQuery {
    watch?: any;
    resourceVersion?: string;
    timeoutSeconds?: number;
    limit?: number; // doesn't work with ?watch
    continue?: string; // might be used with ?limit from second request
}

export class ObjectJsonApi extends JsonApi<ObjectJsonApiData> {
    protected parseError(
        error: ObjectJsonApiError | any,
        res: Response
    ): string[] {
        const { status, reason, message } = error;
        if (status && reason) {
            return [message || `${status}: ${reason}`];
        }
        return super.parseError(error, res);
    }
}
