export const storage = {
    key : 'users',
    get() {
        try {
            const item = localStorage.getItem(this.key);
            return item ? JSON.parse(item) : null;
        } catch {
            return null;
        }
    },
    set(value) {
        return new Promise(resolve => {
            setTimeout(() => {
                localStorage.setItem(this.key, JSON.stringify(value));
                resolve();
            }, 100); // Simulate async delay
        });
    }
};