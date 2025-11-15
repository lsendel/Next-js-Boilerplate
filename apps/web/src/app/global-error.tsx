'use client';

import NextError from 'next/error';
import { useEffect } from 'react';
import { captureException } from '@/libs/LazyMonitoring';
import { routing } from '@/libs/I18nRouting';

export default function GlobalError(props: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Eagerly load Sentry and capture the error
    // This ensures critical errors are reported even if page didn't fully load
    captureException(props.error);
  }, [props.error]);

  return (
    <html lang={routing.defaultLocale}>
      <body>
        {/* `NextError` is the default Next.js error page component. Its type
        definition requires a `statusCode` prop. However, since the App Router
        does not expose status codes for errors, we simply pass 0 to render a
        generic error message. */}
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
