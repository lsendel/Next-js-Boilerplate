'use client';

import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { useTenantPath } from '@/shared/hooks/useTenantPath';

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export type TenantLinkProps = LinkProps
  & Omit<AnchorProps, keyof LinkProps>
  & {
    localeOverride?: string;
  };

const isInternalPath = (value: LinkProps['href']): value is string => {
  return typeof value === 'string' && value.startsWith('/');
};

export function TenantLink(props: TenantLinkProps) {
  const { href, locale: localeProp, localeOverride, ...rest } = props;
  const resolvePath = useTenantPath();

  // Filter out false from localeProp (LinkProps allows false to disable locale routing)
  const localeValue = typeof localeProp === 'string' ? localeProp : undefined;

  const targetHref = isInternalPath(href)
    ? resolvePath(href, { locale: localeOverride ?? localeValue })
    : href;

  return (
    <Link {...rest} href={targetHref} locale={localeProp} />
  );
}
