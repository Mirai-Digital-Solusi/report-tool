export const metadata = {
  title: 'Dashboard : Report View'
};
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { ReportForm } from '@/sections/report/report-form';
import PageContainer from '@/components/layout/page-container';
import { createClient } from '@/utils/supabase/server';

export default async function Page({ params }: any) {
  const breadcrumbItems = [
    { title: 'Dashboard', link: '#' },
    { title: 'Report', link: '#' },
    {
      title: params.reportId === 'new' ? 'Create' : 'Update',
      link: params.reportId === 'new' ? '#' : '#'
    }
  ];

  const supabase = createClient();

  let initialData = null;

  if (params.reportId !== 'new') {
    const { data, error } = await supabase
      .from('reports')
      .select()
      .eq('id', parseInt(params.reportId));

    if (error) {
      throw error;
    }

    initialData = data;
  }

  return (
    <PageContainer scrollable>
      <div className="flex-1 space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <ReportForm initialData={initialData} />
      </div>
    </PageContainer>
  );
}
