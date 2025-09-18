<template>
  <v-container class="pa-6" max-width="1280">
    <v-card class="pa-4 rounded-xl elevation-2">
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h5 font-weight-bold">Учетные записи</span>
        <v-btn color="green" variant="flat" @click="createAccount">Добавить</v-btn>
      </v-card-title>

      <v-card-subtitle class="d-flex align-center text-caption mb-4">
        <v-icon size="small" class="mr-2">mdi-help-circle-outline</v-icon>
        Для указания нескольких меток, используйте разделитель <b>;</b>
      </v-card-subtitle>

      <v-row class="text-body-2 font-weight-medium mb-1">
        <v-col cols="3">Метки</v-col>
        <v-col cols="3">Тип записи</v-col>
        <v-col cols="3">Логин</v-col>
        <v-col cols="2">Пароль</v-col>
        <v-col cols="1"></v-col>
      </v-row>

      <v-divider></v-divider>

      <div class="mt-3">
        <v-card v-for="account in localAccounts" :key="account.id" class="pa-3 mb-2" outlined>
          <v-row dense align="center">
            <v-col cols="3">
              <v-text-field v-model="account.form.marks" label="Метки" density="compact" hide-details="auto"
                variant="outlined" :error="!!account.errors.marks" :error-messages="account.errors.marks"
                @blur="validateFormAndSave(account)" />
            </v-col>

            <v-col cols="3">
              <v-select v-model="account.form.type" :items="['Локальная', 'LDAP']" label="Тип" density="compact"
                hide-details variant="outlined" @update:model-value="onTypeChange(account)" />
            </v-col>

            <v-col cols="3">
              <v-text-field v-model="account.form.login" label="Логин" density="compact" hide-details="auto"
                variant="outlined" :error="!!account.errors.login" :error-messages="account.errors.login"
                @blur="validateFormAndSave(account)" />
            </v-col>

            <v-col cols="2" v-if="account.form.type === 'Локальная'">
              <v-text-field v-model="account.form.password" label="Пароль" density="compact" hide-details="auto"
                variant="outlined" :error="!!account.errors.password" :error-messages="account.errors.password"
                @blur="validateFormAndSave(account)" />
            </v-col>

            <v-col cols="1" class="d-flex justify-center">
              <v-btn icon variant="text" color="red" size="small" @click="deleteAccount(account.id)">
                <v-icon size="small">mdi-delete</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </div>
    </v-card>
  </v-container>

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
const localAccounts = ref<LocalAccount[]>([]);

onMounted(() => {
  loadAccounts();
  console.log(accountStore.accounts);
});

function loadAccounts() {
  localAccounts.value = accountStore.accounts.map((account) => ({
    id: account.id,
    form: {
      marks: account.marks.map((mark) => mark.text).join(';'),
      type: account.type,
      login: account.login,
      password: account.password || null,
    },
    errors: {}
  }));
}

function deleteAccount(id: string) {
  if (id.startsWith('new-')) {
    localAccounts.value = localAccounts.value.filter((account) => account.id !== id);
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
    errors: {}
  };
  localAccounts.value.push(newAccount);
}

function onTypeChange(account: LocalAccount) {
  if (account.form.type === 'LDAP') {
    account.form.password = '';
  }
  validateFormAndSave(account);
}

function validateFormAndSave(account: LocalAccount) {
  account.errors = {};
  const { form, errors } = account;

  if (form.marks.trim().length >= 50) {
    errors.marks = 'Вы превысили максимальное количество символов (50)';
  }

  if (form.login.trim().length >= 100) {
    errors.login = 'Вы превысили максимальное количество символов (100)';
  } else if (form.login.trim().length === 0) {
    errors.login = 'Заполните обязательное поле';
  }

  if (form.type == 'LDAP') {
    form.password = null;
  }

  if (form.type == 'Локальная' && (form.password?.trim().length ?? 0) === 0) {
    errors.password = 'Заполните обязательное поле';
  } else if (form.type == 'Локальная' && form.password && form.password.trim().length >= 100) {
    errors.password = 'Вы превысили максимальное количество символов (100)';
  }

  if (Object.keys(account.errors).length === 0) {
    if (account.id.startsWith('new-')) {
      accountStore.addAccount(account.form);
    } else {
      accountStore.updateAccount(account.id, account.form);
    }
  }
}
</script>
