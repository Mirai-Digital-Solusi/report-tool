import { Breadcrumbs } from '@/components/breadcrumbs';
import PageContainer from '@/components/layout/page-container';
import ReportTable from '../report-tables';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Report } from '@/constants/data';
import { fakeProducts } from '@/constants/mock-api';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import type { SearchParams } from 'nuqs/server';
import { createClient } from '@/utils/supabase/server';
import { getCurrentUser } from '@/utils/supabase/user';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Reports', link: '/dashboard/Report' }
];

type ReportListingPage = {};

export default async function ReportListingPage({}: ReportListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  const offset = (page - 1) * pageLimit;

  const currentUser = getCurrentUser();
  const supabase = createClient();

  let { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select()
    .eq('user_id', (await currentUser).id);

  const role = profiles?.[0]?.role ?? 'User';

  const { count } = await supabase
    .from('reports')
    .select('id', { count: 'exact', head: true });

  const totalReports = Math.ceil(count ?? 0 / 10);

  const { data, error } = await supabase
    .from('reports')
    .select(`id, created_at, created_by, title`)
    .order('id', { ascending: true })
    .range(offset, offset + pageLimit - 1);

  if (error) {
    throw error;
  }

  const pageCount = Math.ceil(totalReports / pageLimit);
  const reports: Report[] = data ?? [];

  return (
    <PageContainer>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-start justify-between">
          <Heading
            title={`Reports (${totalReports})`}
            description="Manage Reports"
          />
          {role === 'Admin' ? (
            <Link
              href={'/dashboard/report/new'}
              className={cn(buttonVariants(), 'text-xs md:text-sm')}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Link>
          ) : null}
        </div>
        <Separator />
        <ReportTable data={reports} totalData={totalReports} />
      </div>
    </PageContainer>
  );
}
