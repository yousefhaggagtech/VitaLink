import { PlayerProfileClient } from './PlayerProfileClient';

export const dynamic = 'force-dynamic';

type PlayerProfilePageProps = {
  params: Promise<{
    username: string;
    playerName: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const firstValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] ?? '' : value ?? '';

const decodeRouteParam = (value: string | undefined, fallback: string) => {
  if (!value) return fallback;

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export default async function PlayerProfilePage({
  params,
  searchParams,
}: PlayerProfilePageProps) {
  const [{ username }, query] = await Promise.all([params, searchParams]);
  const coachName = decodeRouteParam(username, 'Coach');
  const beltId = firstValue(query.beltId);

  return <PlayerProfileClient coachName={coachName} beltId={beltId} />;
}
