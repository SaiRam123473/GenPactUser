import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AddUser from './pages/AddUser.jsx';
import UserList from './pages/UserList.jsx';

export default function App() {
  const [notice, setNotice] = useState('');
  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(current => current === message ? '' : current), 4000);
  }
  return <Routes><Route element={<Layout/>}><Route index element={<UserList notice={notice} clearNotice={() => setNotice('')}/>} /><Route path="add" element={<AddUser onCreated={showNotice}/>} /><Route path="*" element={<Navigate to="/" replace/>}/></Route></Routes>;
}
