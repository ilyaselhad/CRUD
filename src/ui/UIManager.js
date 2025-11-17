import { Toast } from "./Toast.js";

export class UIManager{
    constructor(usermanager){
        this.usermanager = usermanager;
        this.form = document.getElementById('user-form');
        this.tbody = document.getElementById('tbody');
        this.inputs = {
            id : document.getElementById('user-id'),
            name : document.getElementById('name'),
            email : document.getElementById('email'),
            age : document.getElementById('age')
        };
        this.submitBtn = document.getElementById("submit-btn");
        this.bindForm();
        this.bindTableEvents();
        this.render();
    }

    render(){
        const users = this.usermanager.getAll();
        this.tbody.innerHTML = '';
        const list = Array.isArray(users) ? users : (users && Array.isArray(users.array) ? users.array : []);
        for (const e of list) {
            const tr = document.createElement("tr");
            tr.dataset.id = e.id;
            tr.innerHTML = `
            <td>${e.id}</td>
            <td>${e.name}</td>
            <td>${e.email}</td>
            <td>${e.age}</td>
            <td>
                <button class="edit-btn">edit</button>
                <button class="delete-btn">delete</button>
            </td>`;
            this.tbody.appendChild(tr);
        };
    }

    clearForm(){
        this.form.reset();
        this.inputs.id.innerHTML = '';
        if(this.submitBtn) this.submitBtn.textContent = 'Add User';
    }

    bindForm() {
    this.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const idVal = this.inputs.id.value;
      const payload = {
        name: this.inputs.name.value.trim(),
        email: this.inputs.email.value.trim(),
        age: Number(this.inputs.age.value)
      };

      try {
        if (idVal) {
          await this.usermanager.updateUser(Number(idVal), payload);
          Toast.success('Utilisateur mis à jour');
        } else {
          await this.usermanager.addUser(payload);
          Toast.success('Utilisateur ajouté');
        }
        this.clearForm();
        this.render();
      } catch (err) {
        Toast.error(err.message || 'Erreur');
      }
    });
  }

  bindTableEvents() {
    this.tbody.addEventListener('click', async (e) => {
      const target = e.target;
      const row = target.closest('tr');
      if (!row) return;
      const id = Number(row.dataset.id);

      if (target.matches('.edit-btn')) {
        this.prefillForm(id);
      } else if (target.matches('.delete-btn')) {
        const ok = confirm('Supprimer cet utilisateur ?');
        if (!ok) return;
        try {
          await this.usermanager.deleteUser(id);
          Toast.success('Utilisateur supprimé');
          this.render();
        } catch (err) {
          Toast.error(err.message || 'Erreur');
        }
      }
    });
  }

  async prefillForm(id) {
    try {
      let u = await this.usermanager.getUser(id);
      if (!u) throw new Error('Utilisateur non trouvé');
      if (typeof u.toJSON === 'function') u = u.toJSON();
      if (this.inputs.id) this.inputs.id.value = u.id;
      if (this.inputs.name) this.inputs.name.value = u.name;
      if (this.inputs.email) this.inputs.email.value = u.email;
      if (this.inputs.age) this.inputs.age.value = u.age;
      if (this.submitBtn) this.submitBtn.textContent = 'Update User';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      Toast.error(err.message || 'Erreur');
    }
  }
}