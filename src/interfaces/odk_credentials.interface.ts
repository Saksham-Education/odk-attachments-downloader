export interface ODKCredential {
  url: string;
  username: string;
  password: string;
  type: 'aggregate' | 'central';
}
