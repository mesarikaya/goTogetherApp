import ResponseStatus from '../userInterface/responseStatus';

export const UPDATE_RESPONSE_STATUS_REQUEST = 'UPDATE_RESPONSE_STATUS_REQUEST';

interface UpdateResponseStatus {
    type: typeof UPDATE_RESPONSE_STATUS_REQUEST
    payload: ResponseStatus
}

export type UpdateResponseStatusActionType = UpdateResponseStatus;