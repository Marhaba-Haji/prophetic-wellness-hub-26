import React from 'react';
import { Link } from 'react-router-dom';

const AdminFooterLink = () => {
  return (
    <Link to="/admin" className="text-gray-400 hover:text-gray-300 text-sm">
      Admin
    </Link>
  );
};

export default AdminFooterLink;