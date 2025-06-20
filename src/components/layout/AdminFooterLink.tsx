import React from 'react';
import Link from 'next/link';

const AdminFooterLink = () => {
  return (
    <Link href="/admin" className="text-gray-400 hover:text-gray-300 text-sm">
      Admin
    </Link>
  );
};

export default AdminFooterLink;