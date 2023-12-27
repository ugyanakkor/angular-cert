import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CacheService {
    /* 2 hour in milliseconds, this could be modified to set another default value for the timer.
    * magic number = 1000 milliseconds x 60 seconds x 60 minutes x2 hours -> that will set the cache to 2 hours
    * 1000 * 60 * 60 * 2
    * If you want to customize the cache time, you should do it here
    * */
    public cacheTimer = 1000 * 60 * 60 * 2;
    /*
        Emit a boolean value, where another/service component can subscribe and will know when should read the cache again
        It can be smarter if we specify which cache should be red again, but for now I will let it work this way
    */
    public readCacheAgain = new BehaviorSubject<boolean>(true);
    getCacheFromLocalstorage(name: string) {
       return JSON.parse(localStorage.getItem(name)) || [];
    }

    setCacheToLocalstorage(name: string, value): void {
        localStorage.setItem(name, JSON.stringify(value));
    }

    removeItemFromCacheByIndex(cacheName: string, index: number): void {
        let cacheFromLocalstorage = this.getCacheFromLocalstorage(cacheName);
        cacheFromLocalstorage.splice(index, 1);
        this.setCacheToLocalstorage(cacheName, cacheFromLocalstorage);
        this.readCacheAgain.next(true);
    }
}
