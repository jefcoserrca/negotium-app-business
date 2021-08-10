import { FormatColor } from './format-color';
export interface StoreTheme {
    name: string;
    colors: Array<string>;
    topbar: FormatColor,
    storeCard: FormatColor,
    navbar: FormatColor,
    content: FormatColor,
}
