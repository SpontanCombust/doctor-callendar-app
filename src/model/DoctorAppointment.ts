import * as fb from "firebase/firestore";


export interface DoctorAppointment {
    userId: string,
    startDate: fb.Timestamp,
    endDate: fb.Timestamp,
    patientName: string,
    patientSurname: string,
    purpose: string,
    description?: string
}