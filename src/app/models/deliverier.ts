import { FormatColor } from '../interfaces/format-color';
export class Deliverier {
  email: string;
  id?: string;
  label: string;
  lada: string;
  name: string;
  phone: string;
  style: FormatColor;

  toObj?(): any {
    return {
      email: this.email,
      label: this.label,
      lada: this.lada,
      name: this.name,
      phone: this.phone,
      style: this.style,
    };
  }
}
