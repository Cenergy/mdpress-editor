import {
    FetchScheduler
} from 'fetch-scheduler';

const FETCH_REQUEST_COUNT = 6;

export const fetchScheduler = new FetchScheduler({
    requestCount: FETCH_REQUEST_COUNT
});
