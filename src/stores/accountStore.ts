import { defineStore } from "pinia";
import type { Account, AccountForm, MarksType } from "../types/accountTypes";
import { ref } from "vue";
export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<Account[]>([]);
  const loadAccounts = () => {
    const saved = localStorage.getItem('accounts');
    if (saved) {
      accounts.value = JSON.parse(saved);
    }
  }
  const saveAccounts = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts.value));
  }
  const parseMarks = (marks: string): MarksType[] => {
    return marks.split(';').map((char) => ({ text: char.trim() }));
  }
  const addAccount = (formData: AccountForm) => {
    const newAccount: Account = {
      id: new Date().toString(),
      login: formData.login,
      type: formData.type,
      marks: parseMarks(formData.marks),
      password: formData.type === 'Локальная' ? formData.password : null
    }
    accounts.value.push(newAccount);
    saveAccounts();
  }
  const deleteAccount = (id: string) => {
    accounts.value = accounts.value.filter((account) => account.id !== id);
    saveAccounts();
  }
  return { accounts };
})