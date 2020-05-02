


export class Mutex {
    mutex = Promise.resolve();
    locks = [];
    lockCounter = 0;
    unlockCounter = 0;

    lock() {
        let begin;

        this.mutex = this.mutex.then(() => {
            return new Promise(begin);
        });

        const prom = new Promise(res => {
            begin = res;
        });
        this.locks[this.lockCounter++] = begin;
        return prom;
    }

    unlock() {
        this.locks[this.unlockCounter++]();
    }

    async dispatch(fn) {

        await this.lock(value);
        try {
            return await Promise.resolve(fn());
        } finally {

        }
    }
}