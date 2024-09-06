import * as fb from "firebase/firestore";
import { NIL } from 'uuid'


export interface DoctorAppointment {
    appointmentId: string,
    userId: string,
    startDate: fb.Timestamp,
    endDate: fb.Timestamp,
    patientName: string,
    patientSurname: string,
    purpose: string,
    description?: string
}

export const DoctorAppointmentConverter: fb.FirestoreDataConverter<DoctorAppointment> = {
    toFirestore: function (modelObject: fb.WithFieldValue<DoctorAppointment>): fb.WithFieldValue<fb.DocumentData> {
        // we can just return the model itself in this case
        // only conversion we do is stringification, in order to remove `undefined` fields
        return JSON.parse(JSON.stringify(modelObject));
    },
    fromFirestore: function (snapshot: fb.QueryDocumentSnapshot<fb.DocumentData, fb.DocumentData>, options?: fb.SnapshotOptions): DoctorAppointment {
        const data = snapshot.data(options);
        return {
            appointmentId: data.appointmentId ?? NIL,
            userId: data.userId ?? NIL,
            startDate: data.startDate ?? fb.Timestamp.now(),
            endDate: data.endDate ?? fb.Timestamp.now(),
            patientName: data.patientName ?? '',
            patientSurname: data.patientSurname ?? '',
            purpose: data.purpose ?? '',
            description: data.description
        }
    }
}