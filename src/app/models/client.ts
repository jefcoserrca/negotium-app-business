import { FormatColor } from '../interfaces/format-color';
export class Client {
  email: string;
  id: string;
  label: string;
  lada: string;
  name: string;
  phone: string;
  style: FormatColor;
  positiveBalance: number;

  toObj?(): any {
    return {
      email: this.email,
      label: this.label,
      lada: this.lada,
      name: this.name,
      phone: this.phone,
      style: this.style,
      positiveBalance: this.positiveBalance,
    };
  }
}

export class ClientsSettings {
  autoSave: boolean;
  eWallet: boolean;
  percentage: number;

  toObj?(): any {
    return {
      autoSave: this.autoSave,
      eWallet: this.eWallet,
      percentage: this.percentage,
    };
  }
}
