'use client';

import React from 'react';

const FormDivider: React.FC = () => {
  return (
    <div className="flex items-center w-full">
      <div className="flex-grow h-[1px] bg-[#272727]"></div>
      <span className="text-sm px-5">or</span>
      <div className="flex-grow h-[1px] bg-[#272727]"></div>
    </div>
  );
};

export default FormDivider; 