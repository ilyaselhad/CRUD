import { api } from './services/api.js';
import { storage } from './services/storage.js';
import { UserManager } from './models/UserManager.js';
import { UIManager } from './ui/UIManager.js';
import { NetworkError } from './utils/errors.js';
import { Toast } from './ui/Toast.js';

async function bootstrap() {
  const userManager = new UserManager();

  try {
    const local = storage.get();
    if (!local) {

      const data = await api.get('./data.json');
      if (data && Array.isArray(data.users) && data.users.length) {

        for (const u of data.users) {
          await userManager.addUser({ name: u.name, email: u.email, age: u.age });
        }
        Toast.info('Loaded initial users from data.json');
      }
    }
  } catch (err) {
    if (err instanceof NetworkError) {
      Toast.error('No network: using stored data if available');
    } else {
      Toast.error(err.message || 'Erreur au chargement initial');
    }
  }

  new UIManager(userManager);
}

window.addEventListener('DOMContentLoaded', bootstrap);
