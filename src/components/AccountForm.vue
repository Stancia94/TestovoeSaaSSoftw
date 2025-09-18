<template>
  <div class="account-form">
    <div class="account-form__header">
      <h1>Учетные записи</h1>
      <button class="account-form__button">+</button>
    </div>
    <ul class="account-form__labels">
      <li>Метки</li>
      <li>Тип записи</li>
      <li>Логин</li>
      <li>Пароль</li>
    </ul>
    <div class="form-group">
      <input v-model="accountData.marks" type="text" name="marks" id="marks">
      <select v-model="accountData.type" name="type" id="type">
        <option value="Локальная">Локальная</option>
        <option value="LDAP">LDAP</option>
      </select>
      <input v-model="accountData.login" type="text" name="login" id="login">
      <input @change="onTypeChange" v-if="accountData.type !== 'LDAP'" v-model="accountData.password" type="text"
        name="password" id="password">

      <button class="forum-group__delete">delet</button>
    </div>
    <pre>{{ accountData }}</pre>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
interface Account {
  marks: string;
  type: 'Локальная' | 'LDAP';
  login: string;
  password: string | null;
}
const accountData = reactive<Account>({
  marks: '',
  type: 'Локальная',
  login: '',
  password: '',
})
function onTypeChange() {
  if (accountData.type == 'LDAP') {
    accountData.password = null
  }
}
</script>

<style scoped>
.account-form__header {
  display: flex;
  align-items: center;
  justify-content: left;
  column-gap: 20px;
}

.account-form__labels {
  width: 100%;
  display: flex;
  column-gap: 20px;
}

.account-form__labels li {
  flex-grow: 1;
}

.form-group {
  display: flex;
  column-gap: 20px;
}
</style>