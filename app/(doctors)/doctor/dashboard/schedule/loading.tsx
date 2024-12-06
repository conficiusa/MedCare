import Loader from '@/components/blocks/loader';
import React from 'react'

const Loading = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader />
    </div>
  );
}

export default Loading