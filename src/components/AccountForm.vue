<template>
  <div class="form">
    <div class="form__header">
      <h1>Учетные записи</h1>
      <button class="form__add-btn" @click="createAccount">+</button>
    </div>
    <div class="form__hint">
      <img class="hint-icon" src="../assets/ask.svg" alt="">
      Для указания нескольких меток, для одной пары логин/пароль, используйте разделитель
    </div>
    <ul class="form__labels">
      <li>Метки</li>
      <li>Тип записи</li>
      <li>Логин</li>
      <li>Пароль</li>
    </ul>
    <div class="form__account-wrapper">
      <div v-for="account in localAccounts" :key="account.id" class="form__account">
        <div>
          <input @blur="validateFormAndSave(account)" :class="account.errors.marks && 'error'"
            v-model="account.form.marks" type="text" name="marks" id="marks">
          <span class="error-hint" v-if="account.errors.marks">{{ account.errors.marks }}</span>
        </div>
        <select @blur="validateFormAndSave(account)" v-model="account.form.type" name="type" id="type">
          <option value="Локальная">Локальная</option>
          <option value="LDAP">LDAP</option>
        </select>
        <div class="form-group">
          <input @blur="validateFormAndSave(account)" :class="account.errors.login && 'error'"
            v-model="account.form.login" type="text" name="login" id="login">
          <span class="error-hint" v-if="account.errors.login">{{ account.errors.login }}</span>
        </div>
        <div v-if="account.form.type === 'Локальная'" class="form-group">
          <input @blur="validateFormAndSave(account)" :class="account.errors.password && 'error'"
            v-model="account.form.password" type="text" name="password" id="password">
          <span class="error-hint" v-if="account.errors.password">{{ account.errors.password }}</span>
        </div>
        <button class="form__delete-btn" @click="deleteAccount(account.id)">X</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useAccountsStore } from '../stores/accountStore';
import type { AccountForm } from '../types/accountTypes';

interface LocalAccount {
  id: string;
  form: AccountForm;
  errors: {
    marks?: string;
    type?: string;
    login?: string;
    password?: string;
  }
}

const accountStore = useAccountsStore();
const localAccounts = ref<LocalAccount[]>([])

onMounted(() => {
  loadAccounts();
  console.log(accountStore.accounts)
})
function loadAccounts() {
  localAccounts.value = accountStore.accounts.map((account) => ({
    id: account.id,
    form: {
      marks: account.marks.map((mark) => mark.text).join(';'),
      type: account.type,
      login: account.login,
      password: account.password || null,
    },
    errors: {
      marks: '',
      type: '',
      login: '',
      password: '',
    }
  }))
}

function deleteAccount(id: string) {
  if (id.startsWith('new-')) {
    localAccounts.value = localAccounts.value.filter((account) => account.id !== id)
  } else {
    accountStore.deleteAccount(id);
  }
}
function createAccount() {
  const newAccount: LocalAccount = {
    id: 'new-' + new Date().toISOString(),
    form: {
      login: '',
      marks: '',
      password: '',
      type: 'Локальная',
    },
    errors: {
      marks: '',
      type: '',
      login: '',
      password: '',
    },
  }
  localAccounts.value.push(newAccount);
}
function validateFormAndSave(account: LocalAccount) {
  account.errors = {};
  const { form, errors } = account;
  if (form.marks.trim().length > 50) {
    errors.marks = 'Вы превысили максимальное количество символов (50)';
  }

  if (form.login.trim().length > 100) {
    errors.login = 'Вы превысили максимальное количество символов (100)';
  } else if (form.login.trim().length === 0) {
    errors.login = 'Заполните обязательное поле';
  }

  if (form.type == 'LDAP') {
    form.password = null;
  }

  if (form.type == 'Локальная' && (form.password?.trim().length ?? 0) === 0) {
    errors.password = 'Заполните обязательное поле';
  } else if (form.type == 'Локальная' && form.password && (form.password.trim().length > 100)) {
    errors.password = 'Вы превысили максимальное количество символов (100)';
  }

  if (Object.keys(account.errors).length === 0) {
    if (account.id.startsWith('new-')) {
      accountStore.addAccount(account.form)
    } else {
      accountStore.updateAccount(account.id, account.form)
    }
  }

}
</script>

<style scoped>
.form {
  margin: 0 auto;
  max-width: 900px;
}

.form__header {
  display: flex;
  align-items: end;
  justify-content: left;
  column-gap: 16px;
  margin-bottom: 20px;
  font-size: 24px;
}

.hint-icon {
  width: 24px;
  height: 24px;
}

.form__account-wrapper {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.form__add-btn {
  padding: 2px 16px;
  color: white;
  background-color: green;
  border: none;
  border-radius: 4px;
}

.form__delete-btn {
  border-radius: 50%;
  background-color: red;
  font-size: 10px;
  padding: 2px 6px;
  color: white;
  border: none;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form__hint {
  display: flex;
  align-items: center;
  column-gap: 8px;
  margin-bottom: 20px;
  font-size: 12px;
}

.form__labels {
  width: 100%;
  display: flex;
  column-gap: 10px;
  font-size: 12px;
  margin-bottom: 4px;
}

.form__labels li {
  flex-grow: 1;
}

.form__account {
  display: flex;
  column-gap: 20px;
  align-items: start;
}

.error-hint {
  color: red;
  font-size: 10px;
}

.error {
  border: 1px solid red;
}
</style>