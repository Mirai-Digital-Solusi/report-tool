import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { ReportForm } from '../report-form';
import PageContainer from '@/components/layout/page-container';
import { createClient } from '@/utils/supabase/server';

export default async function ReportViewPage({ params }: any) {
  const breadcrumbItems = [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Report', link: '/dashboard/report' },
    {
      title: params.reportId === 'new' ? 'Create' : 'Update',
      link:
        params.reportId === 'new'
          ? '/dashboard/report/create'
          : '/dashboard/report/update'
    }
  ];

  const supabase = createClient();

  let initialData = null;

  if (params.kehadiranId !== 'new') {
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
