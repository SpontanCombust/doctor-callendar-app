import * as fb from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

import { DoctorAppointment, DoctorAppointmentConverter } from "../model/DoctorAppointment";
import { db } from "../firebase";


const COLLECTION_NAME = "appointments";

export const AppointmentsService = {
    getAppointmentsForUser: async function(userId: string, minStartDate?: Date, maxStartDate?: Date) : Promise<DoctorAppointment[]> {
        const collectionRef = fb.collection(db, COLLECTION_NAME);
        let q = fb.query(collectionRef).withConverter(DoctorAppointmentConverter);

        q = fb.query(q, fb.where('userId', '==', userId));

        if (minStartDate) {
            const t = fb.Timestamp.fromDate(minStartDate);
            q = fb.query(q, fb.where('startDate', '>=', t));
        }

        if (maxStartDate) {
            const t = fb.Timestamp.fromDate(maxStartDate);
            q = fb.query(q, fb.where('startDate', '<=', t));
        }

        const snapshot = await fb.getDocs(q);
        
        return snapshot.docs.map(d => d.data());
    },

    // Returns new appointment ID
    addAppointment: async function(appointment: DoctorAppointment) : Promise<string> {
        const appointmentId = uuidv4();
        appointment.appointmentId = appointmentId;

        const appointmentRef = fb.doc(db, COLLECTION_NAME, appointmentId);
        await fb.setDoc(appointmentRef, appointment);
        
        return appointmentId;
    },

    updateAppointment: async function(appointmentId: string, appointment: DoctorAppointment) {
        const appointmentRef = fb.doc(db, COLLECTION_NAME, appointmentId);
        await fb.setDoc(appointmentRef, appointment);
    },

    deleteAppointment: async function(appointmentId: string) {
        const appointmentRef = fb.doc(db, COLLECTION_NAME, appointmentId);
        await fb.deleteDoc(appointmentRef);
    }
};