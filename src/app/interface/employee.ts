export interface Employees {
    id?: string,
    image: string,
    fullname: string,
    email: string,
    phone: string,
    address: string,
    role?: string;
}
export const EMPLOYEES: Employees[] = [
    {
        id: '1',
        image: "/image/avatar.jpg",
        fullname: "Nguyễn Thành Tài",
        email: "thanhtai@gmail.com",
        phone: "0909000888",
        address: "12 ABC Q1 Tp.HCM",
    },
    {
        id: '2',
        image: "/image/avatar.jpg",
        fullname: "Nguyễn Hoàng Yến",
        email: "hoangyen@gmail.com",
        phone: "0909000888",
        address: "12 DCS Q1 Tp.HCM",
    },
]
