'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ExampleFormData, exampleSchema } from '@/validations/example';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type ExampleFormProps = {
  defaultValues?: Partial<ExampleFormData>;
  onSubmit: (data: ExampleFormData) => void;
  isLoading: boolean;
  submitLabel: string;
};

export const ExampleForm = ({ defaultValues, onSubmit, isLoading, submitLabel }: ExampleFormProps) => {
  const form = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      content: defaultValues?.content || '',
      meaning: defaultValues?.meaning || '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>English Sentence (Required)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="e.g. He abandoned the project." 
                  className="resize-none"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="meaning"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vietnamese Meaning (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Anh ấy đã từ bỏ dự án." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
};
