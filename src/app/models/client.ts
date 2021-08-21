import { FormatColor } from '../interfaces/format-color';
export class Client {
  email: string;
  id: string;
  label: string;
  lada: number;
  name: string;
  phone: number;
  style: FormatColor;
  positiveBalance: number;

  toObj(): any {
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
