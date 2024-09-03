import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import { Appointments, DayView, MonthView, Scheduler, Toolbar, ViewSwitcher, WeekView } from '@devexpress/dx-react-scheduler-material-ui'

import './Home.css'
import { Navbar } from '../../components/navbar/Navbar';
import { Paper } from '@mui/material';

const currentDate = '2018-11-01';
const schedulerData: AppointmentModel[] = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

export function Home() {
  return (<>
    <Navbar/>
    <div className='content'>
      <Paper>
        <Scheduler 
          data={schedulerData}
          locale={["pl-PL", "en-US"]}
        >
          <ViewState
            currentDate={currentDate}
          />
          
          <DayView
            startDayHour={7.5}
            endDayHour={17}
          />
          <WeekView
            startDayHour={7.5}
            endDayHour={17}
          />
          <MonthView/>
          
          <Toolbar />
          {/* //FIXME missing localization in the switcher */}
          <ViewSwitcher />
          
          <Appointments/>
        </Scheduler>
      </Paper>
    </div>
  </>);
}
