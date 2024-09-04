import * as dx from '@devexpress/dx-react-scheduler';
import * as dxmui from '@devexpress/dx-react-scheduler-material-ui'

import "./DoctorScheduler.css"


const currentDate = '2018-11-01';
const schedulerData: dx.AppointmentModel[] = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];


export function DoctorScheduler({
  // userId: string
}) {
  return (
    <dxmui.Scheduler 
      data={schedulerData}
      locale={["pl-PL", "en-US"]}
    >
      <dx.ViewState
        defaultCurrentDate={currentDate}
      />
      
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
      
      <dxmui.Appointments/>
      <dxmui.AppointmentTooltip
        showOpenButton
        showDeleteButton
        showCloseButton
      />
    </dxmui.Scheduler>   
  )
}



// function FormLayout(props: AppointmentForm.BasicLayoutProps) {
//   return <AppointmentForm.BasicLayout {...props} locale={"pl"}>
//     <AppointmentForm.Label text='LAbel1' type='titleLabel'/>
//     <AppointmentForm.TextEditor text = 'Editor1' value="Editor1" placeholder='' onValueChange={() => {}} type='ordinaryTextEditor' readOnly={false}/>
//   </AppointmentForm.BasicLayout>
// }


enum SchedulerViewState {
  Day,
  Week,
  Month
}

async function fetchAppointments(currentDate: Date, viewState: SchedulerViewState) {
  //TODO
}