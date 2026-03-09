export interface Users {
  id?: string;
  username: string;
  password: string;
  role: string;
  islocked?: boolean;
  permissions: string[];
}

export const USERS: Users[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    role: 'admin',
    islocked: false,
    permissions: ['create', 'update', 'delete'],
  },
  {
    id: '2',
    username: 'user1',
    password: '123456',
    role: 'user',
    islocked: false,
    permissions: ['create', 'update'],
  },
];

// ✅ Sửa đúng interface Employees
export interface Employees {
  id?: string;
  image: string;
  fullname: string;
  email: string;
  phone: string;
  address: string;
  role?: string;
}

export const EMPLOYEES: Employees[] = [
  {
    id: '1',
    image: '/image/avatar.jpg',
    fullname: 'Nguyễn Thành Tài',
    email: 'thanhtai@gmail.com',
    phone: '0909000888',
    address: '12 ABC Q1 Tp.HCM',
  },
  {
    id: '2',
    image: '/image/avatar.jpg',
    fullname: 'Nguyễn Hoàng Yến',
    email: 'hoangyen@gmail.com',
    phone: '0909000888',
    address: '12 DCS Q1 Tp.HCM',
  },
];

export interface Customer {
  id?: string;
  username: string;
  password: string;
  fullname: string;
  phone: string;
  email: string;
  address: string;
  role: string;
  islocked?: boolean;
}

export const CUSTOMERS: Customer[] = [
  {
    id: 'cus1',
    username: 'john',
    password: '123456',
    fullname: 'John Doe',
    phone: '0909123456',
    email: 'john@gmail.com',
    address: 'Hà Nội',
    role: 'customer',
    islocked: false,
  },
  {
    id: 'cus2',
    username: 'mary',
    password: 'abcdef',
    fullname: 'Mary Jane',
    phone: '0909678967',
    email: 'mary@gmail.com',
    address: 'TP.HCM',
    role: 'customer',
    islocked: true,
  },
];

export const EMPTY_CUSTOMER: Customer = {
  id: '',
  username: '',
  password: '',
  fullname: '',
  phone: '',
  email: '',
  address: '',
  role: 'customer',
  islocked: false,
};
export type AppUser = Customer | Employees;
