export const localStorageService = {
  get(key: string): string {
    return localStorage.getItem(key) || '';
  },
  set(key: string, searchRequest: string): void {
    localStorage.setItem(key, searchRequest);
  }
}