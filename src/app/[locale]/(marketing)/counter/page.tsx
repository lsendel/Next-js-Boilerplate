import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { headers } from 'next/headers';
import Image from 'next/image';
import { CounterForm } from '@/client/components/forms/CounterForm';
import { CurrentCount } from '@/client/components/forms/CurrentCount';
import { getCounter } from '@/libs/services/counter.service';
import { buildLocalizedMetadata } from '@/shared/utils/metadata';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({
    locale,
    namespace: 'Counter',
  });

  return await buildLocalizedMetadata({
    locale,
    path: '/counter',
    title: t('meta_title'),
    description: t('meta_description'),
    keywords: ['Next.js counter example', 'Drizzle ORM example', 'React Hook Form counter'],
  });
}

export default async function Counter() {
  const t = await getTranslations('Counter');
  const id = Number((await headers()).get('x-e2e-random-id')) || 0;
  const count = await getCounter(id);

  return (
    <>
      <CounterForm />

      <div className="mt-3">
        <CurrentCount count={count} />
      </div>

      <div className="mt-5 text-center text-sm">
        {`${t('security_powered_by')} `}
        <a
          className="text-blue-700 hover:border-b-2 hover:border-blue-700"
          href="https://launch.arcjet.com/Q6eLbRE"
        >
          Arcjet
        </a>
      </div>

      <a
        href="https://launch.arcjet.com/Q6eLbRE"
      >
        <Image
          className="mx-auto mt-2"
          src="/assets/images/arcjet-light.svg"
          alt="Arcjet"
          width={128}
          height={38}
        />
      </a>
    </>
  );
}
