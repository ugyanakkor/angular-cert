import { Injectable } from '@angular/core';

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
    getCacheFromLocalstorage(name: string) {
       return JSON.parse(localStorage.getItem(name)) || [];
    }

    setCacheToLocalstorage(name: string, value): void {
        localStorage.setItem(name, JSON.stringify(value));
    }
}
