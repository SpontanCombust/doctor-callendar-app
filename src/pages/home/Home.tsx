import { Navbar } from '../../components/navbar/Navbar';
import { Paper } from '@mui/material';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { logIn } from '../../auth';
import { DoctorScheduler } from '../../components/doctor-scheduler/DoctorScheduler';

import './Home.css'
import googleIcon from './google-logo.svg'


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
          <DoctorScheduler userId={userId}/>
        </Paper>
        :
        <div id="home-not-logged-in" className='flexv center'>
          <h2>Zaloguj się, by przejść do widoku kalendarza</h2>
          <div className='button' onClick={logIn}>
            <img src={googleIcon} alt='Google' width="20px"/>
            <span>Zaloguj się przez Google</span>
          </div>
        </div>
      }
    </div>
  </>);
}
