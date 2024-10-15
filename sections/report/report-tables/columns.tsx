'use client';
import { Report } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
// import Image from 'next/image';
import { CellAction } from './cell-action';
// import { useState } from 'react';
// import { createClient } from '@/utils/supabase/client';

export const columns: ColumnDef<Report>[] = [
  // {
  //   accessorKey: 'image_url',
  //   header: 'IMAGE',
  //   cell: async ({ row }) => {
  //     const [imageUrl, setImageUrl] = useState<string>('');
  //     const supabase = createClient()
  //     const { data: imgUrl } = await supabase.storage
  //       .from('reportTool')
  //       .getPublicUrl(`${row.getValue('image_url')}` ?? '');

  //     if (imgUrl) {
  //       setImageUrl(imgUrl.publicUrl);
  //     }
  //     return (
  //       <div className="relative aspect-square">
  //         {imageUrl && (
  //         <Image
  //           src={imageUrl}
  //           alt="Report Image"
  //           fill
  //           className="rounded-lg"
  //         />
  //       )}
  //       </div>
  //     );
  //   }
  // },
  {
    accessorKey: 'created_at',
    cell: (row) => {
      const dateStr = row.getValue();
      if (typeof dateStr === 'string') {
        const formattedDate = dateStr.split('T')[0]; // extract the date part
        return formattedDate;
      } else {
        return ''; // or some other default value
      }
    },
    header: 'CREATED AT'
  },
  {
    accessorKey: 'created_by',
    header: 'CREATED BY'
  },
  {
    accessorKey: 'title',
    header: 'Title'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
