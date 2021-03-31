import React from 'react';
import ReactDOM from 'react-dom';
import Routing from './components/Routing';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(<BrowserRouter><Routing/></BrowserRouter>,document.getElementById('root'))