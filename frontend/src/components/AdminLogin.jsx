import { useEffect } from 'react';
import { canEdit, goToLogin } from '../lib/api';

// Logging in happens on the normal WordPress login page.
const AdminLogin = () => {
  useEffect(() => {
    if (canEdit()) window.location.replace('/admin');
    else goToLogin();
  }, []);
  return null;
};

export default AdminLogin;
