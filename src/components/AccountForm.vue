<template>
  <div class="form">
    <div class="form__header">
      <h1>Учетные записи</h1>
      <button class="account-form__button">+</button>
    </div>
    <ul class="form__labels">
      <li>Метки</li>
      <li>Тип записи</li>
      <li>Логин</li>
      <li>Пароль</li>
    </ul>
    <div class="form__account">
      <input type="text" name="marks" id="marks">
      <select name="type" id="type">
        <option value="Локальная">Локальная</option>
        <option value="LDAP">LDAP</option>
      </select>
      <input type="text" name="login" id="login">
      <input type="text" name="password" id="password">
      <button class="form__account-delete">delet</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useAccountsStore } from '../stores/accountStore';
import type { AccountForm } from '../types/accountTypes';
interface LocalAccount {
  id: string;
  form: AccountForm;
  errors: {
    marks?: boolean;
    type?: boolean;
    login?: boolean;
    password?: boolean;
  }
}

const accountsStore = useAccountsStore();
const localAccounts = reactive<LocalAccount[]>([])

</script>

<style scoped>
.form__header {
  display: flex;
  align-items: center;
  justify-content: left;
  column-gap: 20px;
}

.form__labels {
  width: 100%;
  display: flex;
  column-gap: 20px;
}

.form__labels li {
  flex-grow: 1;
}

.form__account {
  display: flex;
  column-gap: 20px;
}
</style>