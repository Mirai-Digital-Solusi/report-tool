'use client';

import * as React from 'react';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FileUploader } from '@/components/file-uploader';
import { createClient } from '@/utils/supabase/client';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp'
];

const formSchema = z.object({
  id: z.union([z.string(), z.number(), z.array(z.string()), z.undefined()]),
  // created_at: z.union([z.string(), z.number(), z.array(z.string()), z.undefined()]),
  // image_url: z
  //   .any()
  //   .refine((files) => files?.length == 1, 'Image is required.')
  //   .refine(
  //     (files) => files?.[0]?.size <= MAX_FILE_SIZE,
  //     `Max file size is 5MB.`
  //   )
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
  //     '.jpg, .jpeg, .png and .webp files are accepted.'
  //   ),
  created_by: z.string().min(2, {
    message: 'Report name must be at least 2 characters.'
  }),
  title: z.string().min(5, {
    message: 'Report name must be at least 5 characters.'
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.'
  })
});

type ReportFormValues = z.infer<typeof formSchema>;

interface ReportFormProps {
  initialData: any | null;
}

export const ReportForm: React.FC<ReportFormProps> = ({ initialData }) => {
  const DynamicQuill = useMemo(
    () => dynamic(() => import('@/components/quill'), { ssr: false }),
    []
  );
  const router = useRouter();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const title = initialData ? 'Edit Report' : 'Create Report';
  const description = initialData ? 'Edit a Report' : 'Add a new Report';
  //const toastMessage = initialData ? 'Kehadiran updated.' : 'Kehadiran created.';
  const action = initialData ? 'Save changes' : 'Create';

  const supabase = createClient();

  const defaultValues = initialData
    ? initialData[0]
    : {
        id: '',
        created_at: '',
        created_by: '',
        title: '',
        description: '',
        image_url: ''
      };

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (value: ReportFormValues) => {
    console.log('test initial', initialData);
    try {
      setLoading(true);
      if (initialData) {
        // await axios.post(`/api/Employees/edit-Employee/${initialData._id}`, data);
        const { data, error } = await supabase
          .from('reports')
          .update(value)
          .eq('id', value.id)
          .select();
        router.refresh();
        toast({
          variant: 'default',
          title: 'Update Success.',
          description: 'Update operation is successful!'
        });
      } else {
        const { data, error } = await supabase
          .from('reports')
          .insert([
            {
              created_by: value.created_by,
              title: value.title,
              description: value.description
            }
          ])
          .select();
        router.push(`/dashboard/report`);
        router.refresh();
        toast({
          variant: 'default',
          title: 'Insert Success.',
          description: 'Insert operation is successful!'
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-left text-2xl font-bold">
          {description}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* <FormField
              control={form.control}
              name="image_url"
              render={({ field }) => (
                <div className="space-y-6">
                  <FormItem className="w-full">
                    <FormLabel>Images</FormLabel>
                    <FormControl>
                     <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={4}
                        maxSize={4 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            /> */}

            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input
                      disabled={true}
                      placeholder="ID Kehadiran (Otomatis)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="created_by"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Created By</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter report maker" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter report title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <DynamicQuill
                    value={field.value}
                    onChange={field.onChange}
                    className="max-w-lg"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit">
              {action}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
