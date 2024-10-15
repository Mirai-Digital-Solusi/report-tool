'use client';

import { DataTable } from '@/components/ui/table/data-table';
// import { DataTableFilterBox } from '@/components/ui/table/data-table-filter-box';
// import { DataTableResetFilter } from '@/components/ui/table/data-table-reset-filter';
// import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { Report } from '@/constants/data';
// import {
//   useReportTableFilters
// } from './use-report-table-filters';
import { columns } from './columns';

export default function ReportTable({
  data,
  totalData
}: {
  data: Report[];
  totalData: number;
}) {
  // const {
  //   isAnyFilterActive,
  //   resetFilters,
  //   searchQuery,
  //   setPage,
  //   setSearchQuery
  // } = useReportTableFilters();

  return (
    <div className="space-y-4 ">
      {/* <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div> */}
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
