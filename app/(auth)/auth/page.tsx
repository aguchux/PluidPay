import { NextPage } from 'next';
import React from 'react';
import type { Metadata } from 'next';

import AuthComponent from '@components/AuthComponent';

export const metadata: Metadata = {
  title: 'PluidPay - Auth ',
  description: 'PluidPay - Auth Layout',
};

const AuthLoginPage: NextPage = () => {
  return (
    <div className="p-4 min-h-24 rounded-2xl flex flex-col items-center justify-center">
      <AuthComponent />
    </div>
  );
};

export default AuthLoginPage;
