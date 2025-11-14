'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import { resolveTenantClientPath } from '@/shared/utils/tenant-client-path';

type ResolveTenantPathOptions = {
  locale?: string;
};

export const useTenantPath = () => {
  const locale = useLocale();

  return useCallback((path: string, options: ResolveTenantPathOptions = {}) => {
    return resolveTenantClientPath(path, {
      locale: options.locale ?? locale,
    });
  }, [locale]);
};
