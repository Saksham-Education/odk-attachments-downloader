export interface ODKCredential {
  odkURL: string;
  odkUsername: string;
  odkPassword: string;
  odkType: 'aggregate' | 'central';
}
