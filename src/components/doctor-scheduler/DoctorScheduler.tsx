import { useCallback, useEffect, useState } from 'react';
import * as dx from '@devexpress/dx-react-scheduler';
import * as dxmui from '@devexpress/dx-react-scheduler-material-ui'
import * as mui from '@mui/material'
import * as muidp from '@mui/x-date-pickers'
import * as fb from 'firebase/firestore';
import * as ico from '@mui/icons-material';
import { NIL } from 'uuid';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import pl from 'date-fns/locale/pl';

import { DoctorAppointment } from '../../model/DoctorAppointment';
import { AppointmentsService } from '../../services/AppointmentsService';
import { usePrevious } from '../../utils';

import "./DoctorScheduler.css"


export function DoctorScheduler(props: {
  userId: string
}) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const previousDate = usePrevious(currentDate);
  const [schedulerData, setSchedulerData] = useState<DoctorAppointmentProxy[]>([]);

  /* Disabling this rule, because we're making use of `previousDate` here and adding it as dependency would mean an infinite loop */
  /* eslint-disable react-hooks/exhaustive-deps */

  // initial data update
  useEffect(() => {
    fetchAppointments(props.userId, currentDate, setSchedulerData)
        .catch(console.error);
  }, []);

  // data update on date change 
  useEffect(() => {
    if (previousDate && shouldFetchAppointments(previousDate, currentDate)) {
      fetchAppointments(props.userId, currentDate, setSchedulerData)
        .catch(console.error);
    }
  }, [currentDate]);
  
  /* eslint-enable react-hooks/exhaustive-deps */



  async function commitAppointmentChanges({added, changed, deleted}: dx.ChangeSet) {
    let newData = [...schedulerData];
    
    if (added) {
      try {
        const proxyData = added as DoctorAppointmentProxy;
        proxyData.userId = props.userId;
        const modelData = appointmentProxyToModel(proxyData);

        const newId = await AppointmentsService.addAppointment(modelData);

        proxyData.id = newId;
        newData = [...newData, proxyData];
      } catch(err) {
        console.error('Failed to add new appointments: ' + err);
      }
    }

    if (changed) {
      for(let i = 0; i < newData.length; i += 1) {
        const proxyData = newData[i];
        if (proxyData.id !== undefined && changed[proxyData.id]) {
          try {
            const updatedProxyData: DoctorAppointmentProxy = {...proxyData, ...changed[proxyData.id]};
            const modelData = appointmentProxyToModel(updatedProxyData);

            await AppointmentsService.updateAppointment(modelData.appointmentId, modelData);

            newData[i] = updatedProxyData;
          } catch(err) {
            console.error('Failed to update appointments: ' + err);
          }
        }
      }
    }

    if (deleted) {
      let i = 0;
      // we need a while loop, so that the incrementation can be conditional
      // it needs to be conditional, because we're removing elements along the way
      while (i < newData.length) {
        const proxyData = newData[i];
        if (proxyData.id === deleted) {
          try {
            await AppointmentsService.deleteAppointment(proxyData.id);
            newData.splice(i, 1);
          } catch(err) {
            console.error('Failed to delete an appointment: ' + err);
            i += 1;
          }
        } else {
          i += 1;
        }
      }
    }

    setSchedulerData(newData);
  }

  return (
    <dxmui.Scheduler 
      data={schedulerData}
      locale="pl"
    >
      <dx.ViewState defaultCurrentDate={currentDate} onCurrentDateChange={setCurrentDate}/>
      <dx.EditingState onCommitChanges={commitAppointmentChanges}/>
      <dx.IntegratedEditing/>
      
      <dxmui.DayView
        startDayHour={7.5}
        endDayHour={17}
      />
      <dxmui.WeekView
        startDayHour={7.5}
        endDayHour={17}
      />
      <dxmui.MonthView/>
      
      <dxmui.Toolbar />
      {/* //FIXME missing localization in the switcher */}
      <dxmui.ViewSwitcher />
      <dxmui.DateNavigator/>
      
      <dxmui.Appointments
        appointmentContentComponent={AppointmentContentComponent}
      />
      <dxmui.AppointmentTooltip
        showOpenButton
        showDeleteButton
        showCloseButton

        contentComponent={AppointmentTooltipContent}
      />
      <dxmui.AppointmentForm
        basicLayoutComponent={AppointmentFormBasicLayout}
      />

      <dxmui.DragDropProvider/>
    </dxmui.Scheduler>   
  )
}


// A local appointment model that we use to convert between the data in database and data expected in the scheduler
// Due to how the Meterial components work, its required fields **have to** be compliant with the dx.AppointmentModel interface to make use of built in functions
interface DoctorAppointmentProxy {
  // required fields
  id?: string,
  startDate: Date,
  endDate?: Date,
  title?: string,
  
  // additional data
  userId?: string,
  patientName?: string,
  patientSurname?: string,
  description?: string
}

function appointmentProxyToModel(proxy: DoctorAppointmentProxy): DoctorAppointment {
  return {
    appointmentId: proxy.id ?? NIL,
    userId: proxy.userId ?? NIL,
    startDate: fb.Timestamp.fromDate(proxy.startDate),
    endDate: fb.Timestamp.fromDate(proxy.endDate ?? proxy.startDate),
    purpose: proxy.title ?? '',
    patientName: proxy.patientName ?? '',
    patientSurname: proxy.patientSurname ?? '',
    description: proxy.description ?? ''
  }
}

function appointmentModelToProxy(model: DoctorAppointment): DoctorAppointmentProxy {
  return {
    id: model.appointmentId,
    userId: model.userId,
    startDate: new Date(model.startDate.toMillis()),
    endDate: new Date(model.endDate.toMillis()),
    title: model.purpose,
    patientName: model.patientName,
    patientSurname: model.patientSurname,
    description: model.description
  }
}


// FIXME time not visible
function AppointmentContentComponent(props: dxmui.Appointments.AppointmentContentProps) {
  const data = props.data as DoctorAppointmentProxy;
  return (
  <div className='flexv align-center'>
    <p className='fg-secondary'>{data.patientName} {data.patientSurname}</p>
    <p className='fg-secondary'>{data.title}</p>
    <div className='flexh fg-secondary'>
      {props.formatDate(data.startDate, { hour: 'numeric', minute: 'numeric' })}
      -
      {data.endDate ? props.formatDate(data.endDate, { hour: 'numeric', minute: 'numeric' }) : ''}
    </div>
  </div>
  )
}


function AppointmentTooltipContent(props: dxmui.AppointmentTooltip.ContentProps) {
  const data = props.appointmentData as DoctorAppointmentProxy;
  return (
    <dxmui.AppointmentTooltip.Content {...props}>
      <mui.Grid container alignItems="center">
      <mui.Grid item xs={2} className='text-center'>
        <ico.Person/>
      </mui.Grid>
      <mui.Grid item xs={10}>
        <span>{data.patientName} {data.patientSurname}</span>
      </mui.Grid>
    </mui.Grid>
      
    </dxmui.AppointmentTooltip.Content>
  )
}


function AppointmentFormBasicLayout(props: dxmui.AppointmentForm.BasicLayoutProps) {
  const data = props.appointmentData as DoctorAppointmentProxy;

  const onNameChange = useCallback((patientName?: string) => props.onFieldChange({patientName} as Partial<DoctorAppointmentProxy>), [props]);
  const onSurnameChange = useCallback((patientSurname?: string) => props.onFieldChange({patientSurname} as Partial<DoctorAppointmentProxy>), [props]);
  const onTitleChange = useCallback((title?: string) => props.onFieldChange({title} as Partial<DoctorAppointmentProxy>), [props]);
  const onStartDateChange = useCallback((startDate: Date | null | undefined) => props.onFieldChange({startDate} as Partial<DoctorAppointmentProxy>), [props]);
  const onEndDateChange = useCallback((endDate: Date | null | undefined) => props.onFieldChange({endDate} as Partial<DoctorAppointmentProxy>), [props]);
  const onDescriptionChange = useCallback((description?: string) => props.onFieldChange({description} as Partial<DoctorAppointmentProxy>), [props]);

  return (
    <div className='center appointment-form'>
      <dxmui.AppointmentForm.Label
        text="Dane pacjenta"
        type='titleLabel'
        style={{fontWeight: 'bolder', marginTop: '15px', marginBottom: '5px'}}
      />
      <div className='flexh justify-center'>
        <dxmui.AppointmentForm.TextEditor
          type='ordinaryTextEditor'
          placeholder='Imię'
          value={data.patientName ?? ''}
          onValueChange={onNameChange}
          readOnly={props.readOnly ?? false}
          style={{margin: '0 5px'}}
        />
        <dxmui.AppointmentForm.TextEditor
          type='ordinaryTextEditor'
          placeholder='Nazwisko'
          value={data.patientSurname ?? ''}
          onValueChange={onSurnameChange}
          readOnly={props.readOnly ?? false}
          style={{margin: '0 5px'}}
        />
      </div>

      <dxmui.AppointmentForm.Label
        text="Dane wizyty"
        type='titleLabel'
        style={{fontWeight: 'bolder', marginTop: '15px', marginBottom: '5px'}}
      />
      <dxmui.AppointmentForm.TextEditor
        type='ordinaryTextEditor'
        placeholder='Powód wizyty'
        value={data.title ?? ''}
        onValueChange={onTitleChange}
        readOnly={props.readOnly ?? false}
      />
      <div className='flexh center appointment-form-dates'>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={pl}>
          <muidp.DatePicker
            renderInput={props => <mui.TextField {...props}/>}
            value={data.startDate.toUTCString()}
            onChange={onStartDateChange}
            inputFormat={'MM/dd/yyyy HH:mm'}
            readOnly={props.readOnly ?? false}
          />
          <dxmui.AppointmentForm.Label
            text="-"
            type='ordinaryLabel'
            style={{width: '10%'}}
          />
          <muidp.DatePicker
            renderInput={props => <mui.TextField {...props}/>}
            value={data.endDate?.toUTCString()}
            onChange={onEndDateChange}
            inputFormat={'MM/dd/yyyy HH:mm'}
            readOnly={props.readOnly ?? false}
          />
        </LocalizationProvider>
      </div>

      <dxmui.AppointmentForm.Label
        text="Szczegóły"
        type='titleLabel'
        style={{fontWeight: 'bolder', marginTop: '15px', marginBottom: '5px'}}
      />
      <dxmui.AppointmentForm.TextEditor
          type='multilineTextEditor'
          placeholder=''
          value={data.description ?? ''}
          onValueChange={onDescriptionChange}
          readOnly={props.readOnly ?? false}
        />
    </div>
  )
}


// A relaxed rule for reloading the data
// Since we use at best the month view we can focus on a one month period of cheking and loading the data
function shouldFetchAppointments(previousDate: Date, currentDate: Date) : boolean {
  return previousDate.getFullYear() !== currentDate.getFullYear()  
        || previousDate.getMonth() !== currentDate.getMonth()
}

async function fetchAppointments(userId: string, currentDate: Date, dispatcher: (proxies: DoctorAppointmentProxy[]) => void) {
  const firstDayOfThisMonth = new Date(currentDate);
  firstDayOfThisMonth.setDate(1);
  firstDayOfThisMonth.setHours(0, 0, 0);

  const lastDayOfThisMonth = new Date(firstDayOfThisMonth);
  lastDayOfThisMonth.setMonth(firstDayOfThisMonth.getMonth() + 1);
  lastDayOfThisMonth.setDate(0); // sets the date to the last day of the previous month
  lastDayOfThisMonth.setHours(23, 59, 59);

  const models = await AppointmentsService.getAppointmentsForUser(userId, firstDayOfThisMonth, lastDayOfThisMonth);
  const proxies = models.map(m => appointmentModelToProxy(m));

  dispatcher(proxies);
}