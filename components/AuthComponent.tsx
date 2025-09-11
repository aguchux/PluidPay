'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import logo from '@assets/logo@2x.png';
import { ProgressButton } from '@components/ui';

const AuthComponent = () => {
  const router = useRouter();
  return (
    <>
      <Image src={logo.src} alt="PluidPay Logo" width={100} height={100} className="mb-4" />
      <h1 className="text-xl font-semibold">Go to Pluid</h1>
      <ProgressButton
        duration={5500}
        onComplete={() => router.push('/dashboard')}
        className="w-40 mt-10"
      >
        Login to Pluid
      </ProgressButton>
    </>
  );
};

export default AuthComponent;
