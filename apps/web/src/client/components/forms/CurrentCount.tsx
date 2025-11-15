'use client';

import { useTranslations } from 'next-intl';

export const CurrentCount = (props: { count: number }) => {
  const t = useTranslations('CurrentCount');

  return <div>{t('count', { count: props.count })}</div>;
};
