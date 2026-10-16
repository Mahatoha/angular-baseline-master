import { Service } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";

@Service()
export class PrefetchService {
    private readonly _isLoadingDataSubject$ = new BehaviorSubject<boolean>(false);

    public set isLoadingData(isLoading: boolean) {
        this._isLoadingDataSubject$.next(isLoading);
    }

    public get isLoadingData$(): Observable<boolean> {
        return this._isLoadingDataSubject$.asObservable();
    }
}
