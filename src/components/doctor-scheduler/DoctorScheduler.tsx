import { useCallback, useState } from 'react';
import * as dx from '@devexpress/dx-react-scheduler';
import * as dxmui from '@devexpress/dx-react-scheduler-material-ui'
import * as mui from '@mui/material'
import * as fb from 'firebase/firestore';
import * as ico from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid'

import { DoctorAppointment } from '../../model/DoctorAppointment';

import "./DoctorScheduler.css"



const currentDate = '2018-11-01';


export function DoctorScheduler(props: {
  userId: string
}) {
  // TODO: replace with firestore connection later
  const [schedulerData, setSchedulerData] = useState<DoctorAppointmentProxy[]>([
    { 
      id: uuidv4(),
      userId: props.userId,
      startDate: new Date('2018-11-01T09:45'), 
      endDate: new Date('2018-11-01T11:00'), 
      patientName: 'John',
      patientSurname: 'Doe',
      title: 'Sore throat',
    },
    { 
      id: uuidv4(),
      userId: props.userId,
      startDate: new Date('2018-11-01T12:00'), 
      endDate: new Date('2018-11-01T13:30'), 
      patientName: 'Marry',
      patientSurname: 'Ann',
      title: 'Muscle pain',
    },
  ]);

  function commitAppointmentChanges({added, changed, deleted}: dx.ChangeSet) {
    let newData = [...schedulerData];
    
    if (added) {
      const newId = uuidv4();
      const data = added as DoctorAppointmentProxy;
      newData = [...newData, {...data, id: newId}];
    }
    if (changed) {
      newData = newData.map(appointment => {
        if (changed[appointment.id]) {
          const data = changed[appointment.id] as Partial<DoctorAppointmentProxy>;
          return {...appointment, ...data};
        } else {
          return appointment;
        }
      });
    }
    if (deleted) {
      newData = newData.filter(appointment => {
        return appointment.id !== deleted;
      });
    }

    setSchedulerData(newData);
  } 

  return (
    <dxmui.Scheduler 
      data={schedulerData}
      locale="pl"
    >
      <dx.ViewState defaultCurrentDate={currentDate}/>
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
  id: string,
  startDate: Date,
  endDate: Date,
  title: string,
  
  // additional data
  userId: string,
  patientName: string,
  patientSurname: string,
  description?: string
}

function appointmentProxyToModel(proxy: DoctorAppointmentProxy): [string, DoctorAppointment] {
  return [proxy.id, {
    userId: proxy.userId,
    startDate: fb.Timestamp.fromDate(proxy.startDate),
    endDate: fb.Timestamp.fromDate(proxy.endDate),
    purpose: proxy.title,
    patientName: proxy.patientName,
    patientSurname: proxy.patientSurname,
    description: proxy.description
  }]
}

function appointmentModelToProxy(id: string, model: DoctorAppointment): DoctorAppointmentProxy {
  return {
    id,
    userId: model.userId,
    startDate: new Date(model.startDate.toMillis()),
    endDate: new Date(model.endDate.toMillis()),
    title: model.purpose,
    patientName: model.patientName,
    patientSurname: model.patientSurname,
    description: model.description
  }
}



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

  const onNameChange = useCallback((patientName) => props.onFieldChange({patientName} as Partial<DoctorAppointmentProxy>), [props]);
  const onSurnameChange = useCallback((patientSurname) => props.onFieldChange({patientSurname} as Partial<DoctorAppointmentProxy>), [props]);
  const onTitleChange = useCallback((title) => props.onFieldChange({title} as Partial<DoctorAppointmentProxy>), [props]);
  const onStartDateChange = useCallback((startDate) => props.onFieldChange({startDate} as Partial<DoctorAppointmentProxy>), [props]);
  const onEndDateChange = useCallback((endDate) => props.onFieldChange({endDate} as Partial<DoctorAppointmentProxy>), [props]);
  const onDescriptionChange = useCallback((description) => props.onFieldChange({description} as Partial<DoctorAppointmentProxy>), [props]);

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
          value={data.patientName}
          onValueChange={onNameChange}
          readOnly={props.readOnly ?? false}
          style={{margin: '0 5px'}}
        />
        <dxmui.AppointmentForm.TextEditor
          type='ordinaryTextEditor'
          placeholder='Nazwisko'
          value={data.patientSurname}
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
        value={data.title}
        onValueChange={onTitleChange}
        readOnly={props.readOnly ?? false}
      />
      <div className='flexh center'>
        <dxmui.AppointmentForm.DateEditor
          value={data.startDate.toUTCString()}
          onValueChange={onStartDateChange}
          locale='pl'
          readOnly={props.readOnly ?? false}
          style={{width: '45%'}}
        />
        <dxmui.AppointmentForm.Label
          text="-"
          type='ordinaryLabel'
          style={{width: '10%'}}
        />
        <dxmui.AppointmentForm.DateEditor
          value={data.endDate.toUTCString()}
          onValueChange={onEndDateChange}
          locale='pl'
          readOnly={props.readOnly ?? false}
          style={{width: '45%'}}
        />
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


enum SchedulerViewState {
  Day,
  Week,
  Month
}

async function fetchAppointments(currentDate: Date) {
  //TODO
}