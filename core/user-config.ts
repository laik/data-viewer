import { bind } from './utils/bind';

@bind()
export class Menu {
  name: string;
  link: string;
  title: string;
  icon: string;
  children: Menu[];
  getAll(): string {
    return JSON.stringify(this);
  }
}

@bind()
export class UserConfig {
  userName: string;
  token: string;
  constructor(data: any) {
    Object.assign(this, data);
  }
}
