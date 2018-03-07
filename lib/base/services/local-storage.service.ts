
export class LocalStorageService {
    get(key: string): any {
        return JSON.parse(localStorage.getItem(key) || 'null') || null;
    }

    set(key: string, value: any): boolean {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }

    remove(key: string) {
        localStorage.removeItem(key);
    }

}
