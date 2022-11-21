export interface Person {
    phoneNumber: number;
    firstName: string;
    lastName: string;
    address: string;
}

export interface PersonEvent {
    action: string;
    phoneNumber: number;
}
