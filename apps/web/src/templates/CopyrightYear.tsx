'use client';

import { useEffect, useState } from 'react';

export const CopyrightYear = () => {
  const [year, setYear] = useState(2024);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
};
