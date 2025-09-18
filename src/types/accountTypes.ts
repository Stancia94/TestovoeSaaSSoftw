export type MarksType = {
  text: string;
}
export type AccountType = 'Локальная' | 'LDAP';
export interface Account {
  id: string;
  marks: MarksType[];
  type: AccountType;
  login: string;
  password: string | null;
}
export interface AccountForm {
  marks: string;
  type: AccountType;
  login: string;
  password: string | null;
}