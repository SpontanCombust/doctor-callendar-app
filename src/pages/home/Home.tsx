import { AppointmentModel, ViewState } from '@devexpress/dx-react-scheduler';
import { Appointments, DayView, MonthView, Scheduler, Toolbar, ViewSwitcher, WeekView } from '@devexpress/dx-react-scheduler-material-ui'

import { Navbar } from '../../components/navbar/Navbar';
import { Paper } from '@mui/material';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { logIn } from '../../auth';

import './Home.css'
import googleIcon from './google-logo.svg'


const currentDate = '2018-11-01';
const schedulerData: AppointmentModel[] = [
  { startDate: '2018-11-01T09:45', endDate: '2018-11-01T11:00', title: 'Meeting' },
  { startDate: '2018-11-01T12:00', endDate: '2018-11-01T13:30', title: 'Go to a gym' },
];

export function Home() {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  onAuthStateChanged(auth, (user) => {
    setUserId(user?.uid)
  });

  return (<>
    <Navbar/>
    <div className='content'>
      {userId !== undefined ?
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
        :
        <div id='schedule-not-signedin'>
          <h3>Zaloguj się, by przejść do widoku kalendarza</h3>
          <div className='button' onClick={logIn}>
            <img src={googleIcon} width="20px"/>
            <span>Zaloguj się przez Google</span>
          </div>
        </div>
      }
    </div>
  </>);
}
