import { Timestamp } from "firebase/firestore";


export interface DoctorAppointment {
    userId: string,
    startDate: Timestamp,
    endDate?: Timestamp,
    patientName: string,
    patientSurname: string,
    synopsis: string,
    description?: string
}